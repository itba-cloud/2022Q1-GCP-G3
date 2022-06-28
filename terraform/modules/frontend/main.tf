# Frontend bucket
resource "google_storage_bucket" "frontend" {
  provider                    = google-beta
  project                     = var.project
  name                        = var.frontend_domain
  location                    = var.location
  force_destroy               = true
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }

  dynamic "cors" {
    for_each = ["cors"]
    content {
      origin          = var.cors_origins
      method          = var.cors_methods
      response_header = var.cors_headers
      max_age_seconds = var.cors_max_age
    }
  }
}

resource "google_compute_global_address" "frontend_ip" {
  provider = google
  name     = "frontend-static-ip"
  project  = var.project
}

resource "google_storage_bucket_iam_member" "member" {
  bucket = google_storage_bucket.frontend.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# GCP Backend for frontend
resource "google_compute_backend_bucket" "frontend_backend_service" {
  provider    = google
  name        = "frontend-backend-service"
  description = "Contains files needed by the frontend application"
  bucket_name = google_storage_bucket.frontend.name
  project     = var.project
  enable_cdn  = true
  lifecycle {
    create_before_destroy = false
  }
}

# Create HTTPS certificate
resource "google_compute_managed_ssl_certificate" "frontend_certificate" {
  provider = google-beta
  project  = var.project
  name     = "frontend-ssl-certificate"
  managed {
    domains = [var.frontend_domain]
  }
}

# Create URL map
resource "google_compute_url_map" "frontend_url_map" {
  provider        = google-beta
  name            = "lb-frontend"
  project         = var.project
  default_service = google_compute_backend_bucket.frontend_backend_service.id
}

# Create HTTPs target proxy
resource "google_compute_target_https_proxy" "frontend_https_proxy" {
  provider         = google-beta
  name             = "frontend-https-proxy"
  project          = var.project
  url_map          = google_compute_url_map.frontend_url_map.id
  ssl_certificates = [google_compute_managed_ssl_certificate.frontend_certificate.id]
}

# GCP forwarding rule
resource "google_compute_global_forwarding_rule" "frontend_forwarding_rule" {
  provider              = google
  name                  = "frontend-forwarding-rule"
  project               = var.project
  load_balancing_scheme = "EXTERNAL"
  ip_address            = google_compute_global_address.frontend_ip.address
  ip_protocol           = "HTTPS"
  port_range            = "443"
  target                = google_compute_target_https_proxy.frontend_https_proxy.self_link
}

### HTTP-to-HTTPS redirect ###
resource "google_compute_url_map" "http-redirect" {
  name    = "http-redirect"
  project = var.project

  default_url_redirect {
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT" // 301 redirect
    strip_query            = false
    https_redirect         = true
  }
}

resource "google_compute_target_http_proxy" "http-redirect" {
  name    = "http-redirect"
  project = var.project
  url_map = google_compute_url_map.http-redirect.self_link
}

resource "google_compute_global_forwarding_rule" "http-redirect" {
  name       = "http-redirect"
  project    = var.project
  target     = google_compute_target_http_proxy.http-redirect.self_link
  ip_address = google_compute_global_address.frontend_ip.address
  port_range = "80"
}


/* CLOUD BUILD */
resource "google_cloudbuild_trigger" "github_push_trigger" {
  name     = var.cloud_build_name
  filename = var.cloud_build_filename
  github {
    name  = "TP-Cloud"
    owner = "edamm21"
    push {
      branch       = "master"
      invert_regex = false
    }
  }
}