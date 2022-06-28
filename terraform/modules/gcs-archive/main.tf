# Frontend bucket
resource "google_storage_bucket" "archives" {
  provider                    = google-beta
  project                     = var.project
  name                        = "archives-${var.project}"
  location                    = "US"
  force_destroy               = true
  storage_class               = "NEARLINE"
  uniform_bucket_level_access = true

  lifecycle_rule {
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }
    condition {
      age = 90
    }
  }

  lifecycle_rule {
    action {
      type          = "SetStorageClass"
      storage_class = "ARCHIVE"
    }
    condition {
      age = 365
    }
  }

  versioning {
    enabled = true
  }
}

resource "google_service_account" "sa" {
  project      = var.project
  account_id   = "to-admin-archives"
  display_name = "A service account that can administrate archives bucket"
}

resource "google_storage_bucket_iam_member" "member" {
  bucket = google_storage_bucket.archives.name
  role   = "roles/storage.admin"
  member = "serviceAccount:${var.service_account_email}"
}
