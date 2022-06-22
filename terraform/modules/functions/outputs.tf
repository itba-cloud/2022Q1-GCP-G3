output "backend_ip" {
	value = module.lb-http.external_ip
}

output "service_account_email" {
	value = google_cloudfunctions_function.function["default"].service_account_email
}