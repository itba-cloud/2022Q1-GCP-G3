# Enable Cloud Functions API
resource "google_project_service" "cf" {
  project = var.project
  service = "cloudfunctions.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Enable Cloud Build API
resource "google_project_service" "cb" {
  project = var.project
  service = "cloudbuild.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Enable Compute API
resource "google_project_service" "c" {
  project = var.project
  service = "compute.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Enable Service Networking
resource "google_project_service" "sn" {
  project = var.project
  service = "servicenetworking.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Enable VPC Access API
resource "google_project_service" "vp" {
  project = var.project
  service = "vpcaccess.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Enable DNS API
resource "google_project_service" "dns" {
  project = var.project
  service = "dns.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

/* CLOUD SQL */
module "sql" {
	depends_on = [
		google_project_service.c,
		google_project_service.sn
	]
	source = "./modules/sql"
	project = var.project
	region = var.region
}

/* SERVERLESS ACCESS CONNECTOR */
module "connector" {
	depends_on = [
		module.sql.vpc,
		google_project_service.vp
	]
	source = "./modules/connector"
	project = var.project
	vpc = module.sql.vpc
	region = var.region
}

/* FRONTEND */
module "frontend" {
	depends_on = [
		google_project_service.c,
		google_project_service.cb
	]
	source = "./modules/frontend"
	project = var.project
	location = var.location
	frontend_domain = var.frontend_domain
	repo_suffix = var.repo_suffix
}


/* CLOUD FUNCTIONS */
module "functions" {
	depends_on = [
		google_project_service.cf,
		module.connector,
		module.sql,
		module.frontend,
	]
	source = "./modules/functions"
	project = var.project
	region = var.region
	api_domain = var.api_domain
	domain = var.domain
	master_instance = module.sql.master_instance
	user = module.sql.user
	sac = module.connector.sac
	frontend_ip = module.frontend.frontend_ip
}

/* GCS ARCHIVES */
module "gcs-archive" {
	depends_on = [
		module.functions
	]
	source = "./modules/gcs-archive"
	project = var.project
	service_account_email = module.functions.service_account_email
}
