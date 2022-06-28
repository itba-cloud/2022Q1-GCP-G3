variable "project" {
  description = "Project name"
  type        = string
  default     = "cloud-student-system"
}

variable "location" {
  description = "Project location"
  type        = string
  default     = "southamerica-east1"
}

variable "region" {
  description = "Project region"
  type        = string
  default     = "southamerica-east1"
}

variable "zone" {
  description = "Project zone"
  type        = string
  default     = "southamerica-east1-a"
}

variable "api_domain" {
  description = "API Domain"
  type        = string
  default     = "api.tpcloud.com.ar"
}

variable "frontend_domain" {
  description = "Frontend Domain"
  type        = string
  default     = "tpcloud.com.ar"
}

variable "domain" {
  description = "Domain"
  type        = string
  default     = "tpcloud"
}

variable "repo_suffix" {
  description = "Github repository name"
  type        = string
  default     = "edamm/TP-Cloud"
}

