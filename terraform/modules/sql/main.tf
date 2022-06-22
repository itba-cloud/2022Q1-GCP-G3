# VPC
resource "google_compute_network" "vpc_network" {
  name                    = "vpc-${var.project}"
	project 								= var.project
  auto_create_subnetworks = "false"
}

# Allocate an IP address range
resource "google_compute_global_address" "private_ip_address" {
  name          = "private-ip-vpc-${var.project}"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 20
  network       = google_compute_network.vpc_network.id
}

# Create a private connection
resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc_network.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
}

/* MASTER */
resource "google_sql_database_instance" "master_instance" {
	provider = google-beta
  name             = "sql-instance-${var.project}"
	region 					 = var.region
  database_version = "POSTGRES_14"

	depends_on = [google_service_networking_connection.private_vpc_connection]

  settings {
    tier = "db-f1-micro"
		availability_type = "ZONAL"
		disk_size = "20"
		disk_type = "PD_SSD"
		location_preference {
			zone = "southamerica-east1-a"
		}
		backup_configuration {
			enabled = true
			point_in_time_recovery_enabled = true
		}
		ip_configuration {
			ipv4_enabled = false
			private_network = google_compute_network.vpc_network.id
		}
  }

	deletion_protection = "false"
}

/* REPLICA */
resource "google_sql_database_instance" "replica_instance" {
	provider = google-beta
	depends_on = [
		google_sql_database_instance.master_instance,
		google_service_networking_connection.private_vpc_connection
	]

  name             = "sql-instancereplica-${var.project}"
	region 					 = var.region
	master_instance_name = google_sql_database_instance.master_instance.name
	database_version = "POSTGRES_14"
  settings {
		tier = "db-f1-micro"
		availability_type = "ZONAL"
		disk_size = "20"
		disk_type = "PD_SSD"
		location_preference {
			zone = "southamerica-east1-b"
		}
		backup_configuration {
			enabled = true
			point_in_time_recovery_enabled = true
		}
		ip_configuration {
			ipv4_enabled = false
			private_network = google_compute_network.vpc_network.id
		}
  }

  deletion_protection = "false"
}

resource "google_sql_user" "users" {
  name     = "admin"
  instance = google_sql_database_instance.master_instance.name
  password = "123jk1kganmQ@"
}