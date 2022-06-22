/* SUBNET */
resource "google_compute_subnetwork" "subnet_sac" {
	name = "subnet-sac-${var.project}"
	ip_cidr_range = "10.1.0.0/28"
	network = var.vpc.id
	project = var.project
	region = var.region
}

/* SERVERLESS ACCESS CONNECTOR */
resource "google_vpc_access_connector" "sac" {
	provider = google-beta
	project = var.project
	region = var.region
  name          = "sac"
  subnet {
		name = google_compute_subnetwork.subnet_sac.name
	}
	machine_type = "f1-micro"
	min_instances = 2
	max_instances = 5
}