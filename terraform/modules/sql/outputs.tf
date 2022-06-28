output "master_instance" {
  value = google_sql_database_instance.master_instance
}

output "vpc" {
  value = google_compute_network.vpc_network
}

output "user" {
  value = google_sql_user.users
}