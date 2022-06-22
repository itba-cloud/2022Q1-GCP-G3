/* FRONTEND */

# Create DNS managed zone
resource "google_dns_managed_zone" "frontend_dns_zone" {
  provider = google
  name = "frontend-dns-zone"
  dns_name = "${var.frontend_domain}."
}

# Add static IP to DNS
resource "google_dns_record_set" "frontend_A_record" {
  provider = google
  name = "${var.frontend_domain}."
  type = "A"
  ttl = 300
  managed_zone = google_dns_managed_zone.frontend_dns_zone.name
  rrdatas = [var.frontend_ip]
  depends_on = [google_dns_managed_zone.frontend_dns_zone]
}

# Add www registry to DNS
resource "google_dns_record_set" "frontend_WWW_record" {
  provider = google
  name = "www.${var.frontend_domain}."
  type = "CNAME"
  ttl = 300
  managed_zone = google_dns_managed_zone.frontend_dns_zone.name
  rrdatas = ["${var.frontend_domain}."]
  depends_on = [google_dns_managed_zone.frontend_dns_zone]
}

/* BACKEND */

# Create DNS managed zone
resource "google_dns_managed_zone" "frontend_dns_zone" {
  provider = google
  name = "backend-dns-zone"
  dns_name = "${var.backend_domain}."
}

# Add static IP to DNS
resource "google_dns_record_set" "frontend_A_record" {
  provider = google
  name = "${var.backend_domain}."
  type = "A"
  ttl = 300
  managed_zone = google_dns_managed_zone.backend_dns_zone.name
  rrdatas = [var.backend_ip]
  depends_on = [google_dns_managed_zone.backend_dns_zone]
}