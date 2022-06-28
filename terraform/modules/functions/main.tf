data "archive_file" "source" {
  for_each    = local.functions
  type        = "zip"
  source_dir  = "../src/functions/${each.value}"
  output_path = "/tmp/${each.value}.zip"
}

# Create bucket that will host the source code
resource "google_storage_bucket" "bucket-functions" {
  location = var.region
  name     = "bucket-functions-${var.project}"
  project  = var.project
}

# Add source code zip to bucket
resource "google_storage_bucket_object" "function-zip" {
  # Append file MD5 to force bucket to be recreated
  for_each = local.functions
  name     = "${each.value}.zip"
  bucket   = google_storage_bucket.bucket-functions.name
  source   = data.archive_file.source[each.key].output_path
}

# Create Cloud Function
resource "google_cloudfunctions_function" "function" {
  for_each = local.functions
  name     = "function-${each.value}"
  project  = var.project
  runtime  = "nodejs16"
  region   = var.region

  available_memory_mb   = 128
  trigger_http          = true
  entry_point           = each.value
  ingress_settings      = "ALLOW_INTERNAL_AND_GCLB"
  source_archive_bucket = google_storage_bucket.bucket-functions.name
  source_archive_object = google_storage_bucket_object.function-zip[each.key].name
  environment_variables = {
    DB_USER = var.user.name
    DB_PASS = var.user.password
    DB_NAME = var.master_instance.name
    DB_HOST = "${var.master_instance.private_ip_address}:3306"
  }
  vpc_connector                 = var.sac.name
  vpc_connector_egress_settings = "ALL_TRAFFIC"

  depends_on = [
    var.sac
  ]
}

# IAM entry for all users to invoke the function
resource "google_cloudfunctions_function_iam_member" "invoker" {
  for_each       = local.functions
  project        = google_cloudfunctions_function.function[each.key].project
  region         = google_cloudfunctions_function.function[each.key].region
  cloud_function = google_cloudfunctions_function.function[each.key].name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}

resource "google_compute_region_network_endpoint_group" "serverless_neg" {
  for_each              = local.functions
  provider              = google-beta
  name                  = "neg-${lower(each.value)}"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  project               = var.project
  cloud_function {
    function = google_cloudfunctions_function.function[each.key].name
  }
}

resource "google_compute_security_policy" "policy" {
  name    = "allow-only-frontend"
  project = var.project

  rule {
    action   = "deny(403)"
    priority = "2147483647"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    description = "default rule"
  }

  rule {
    action   = "allow"
    priority = "1000"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["${var.frontend_ip}/32"]
      }
    }
    description = "Allow access from frontend"
  }
}

/* LB FUNCTIONS */
module "lb-http" {
  source  = "GoogleCloudPlatform/lb-http/google//modules/serverless_negs"
  version = "~> 6.2.0"
  name    = "lb-functions-${var.project}"
  project = var.project

  ssl                             = true
  use_ssl_certificates            = false
  managed_ssl_certificate_domains = [var.api_domain]
  https_redirect                  = false
  security_policy                 = google_compute_security_policy.policy.name

  url_map        = google_compute_url_map.url_map.self_link
  create_url_map = false

  backends = {
    default = {
      groups = [
        {
          group = google_compute_region_network_endpoint_group.serverless_neg["default"].id
        }
      ]
      description             = null
      enable_cdn              = false
      security_policy         = google_compute_security_policy.policy.name
      custom_request_headers  = null
      custom_response_headers = null

      iap_config = {
        enable               = false
        oauth2_client_id     = ""
        oauth2_client_secret = ""
      }
      log_config = {
        enable      = false
        sample_rate = null
      }
    }
    deleteusersubject = {
      groups = [
        {
          group = google_compute_region_network_endpoint_group.serverless_neg["deleteUserSubject"].id
        }
      ]
      description             = null
      enable_cdn              = false
      security_policy         = google_compute_security_policy.policy.name
      custom_request_headers  = null
      custom_response_headers = null

      iap_config = {
        enable               = false
        oauth2_client_id     = ""
        oauth2_client_secret = ""
      }
      log_config = {
        enable      = false
        sample_rate = null
      }
    }
    getallsubjects = {
      groups = [
        {
          group = google_compute_region_network_endpoint_group.serverless_neg["getAllSubjects"].id
        }
      ]
      description             = null
      enable_cdn              = false
      security_policy         = google_compute_security_policy.policy.name
      custom_request_headers  = null
      custom_response_headers = null

      iap_config = {
        enable               = false
        oauth2_client_id     = ""
        oauth2_client_secret = ""
      }
      log_config = {
        enable      = false
        sample_rate = null
      }
    }
    getusersubjects = {
      groups = [
        {
          group = google_compute_region_network_endpoint_group.serverless_neg["getUserSubjects"].id
        }
      ]
      description             = null
      enable_cdn              = false
      security_policy         = google_compute_security_policy.policy.name
      custom_request_headers  = null
      custom_response_headers = null

      iap_config = {
        enable               = false
        oauth2_client_id     = ""
        oauth2_client_secret = ""
      }
      log_config = {
        enable      = false
        sample_rate = null
      }
    }
    login = {
      groups = [
        {
          group = google_compute_region_network_endpoint_group.serverless_neg["login"].id
        }
      ]
      description             = null
      enable_cdn              = false
      security_policy         = google_compute_security_policy.policy.name
      custom_request_headers  = null
      custom_response_headers = null

      iap_config = {
        enable               = false
        oauth2_client_id     = ""
        oauth2_client_secret = ""
      }
      log_config = {
        enable      = false
        sample_rate = null
      }
    }
    postuser = {
      groups = [
        {
          group = google_compute_region_network_endpoint_group.serverless_neg["postUser"].id
        }
      ]
      description             = null
      enable_cdn              = false
      security_policy         = google_compute_security_policy.policy.name
      custom_request_headers  = null
      custom_response_headers = null

      iap_config = {
        enable               = false
        oauth2_client_id     = ""
        oauth2_client_secret = ""
      }
      log_config = {
        enable      = false
        sample_rate = null
      }
    }
    postusersubject = {
      groups = [
        {
          group = google_compute_region_network_endpoint_group.serverless_neg["postUserSubject"].id
        }
      ]
      description             = null
      enable_cdn              = false
      security_policy         = google_compute_security_policy.policy.name
      custom_request_headers  = null
      custom_response_headers = null

      iap_config = {
        enable               = false
        oauth2_client_id     = ""
        oauth2_client_secret = ""
      }
      log_config = {
        enable      = false
        sample_rate = null
      }
    }
  }
}

resource "google_compute_url_map" "url_map" {
  name            = "lb-functions-${var.project}"
  default_service = module.lb-http.backend_services["default"].self_link
  project         = var.project

  host_rule {
    hosts        = [var.api_domain]
    path_matcher = var.domain
  }

  path_matcher {
    name            = var.domain
    default_service = module.lb-http.backend_services["default"].self_link

    dynamic "path_rule" {
      for_each = local.functions

      content {
        paths   = ["/${lower(path_rule.value)}"]
        service = module.lb-http.backend_services[lower(path_rule.key)].self_link
      }
    }
  }
}