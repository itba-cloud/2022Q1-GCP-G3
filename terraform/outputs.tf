output "frontend_ip" {
	value = module.frontend.frontend_ip
}

output "backend_ip" {
	value = module.functions.backend_ip
}