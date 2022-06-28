<!-- BEGIN_TF_DOCS -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_google"></a> [google](#provider\_google) | n/a |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [google_dns_managed_zone.frontend_dns_zone](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/dns_managed_zone) | resource |
| [google_dns_record_set.frontend_A_record](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/dns_record_set) | resource |
| [google_dns_record_set.frontend_WWW_record](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/dns_record_set) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_backend_domain"></a> [backend\_domain](#input\_backend\_domain) | n/a | `any` | n/a | yes |
| <a name="input_backend_ip"></a> [backend\_ip](#input\_backend\_ip) | n/a | `any` | n/a | yes |
| <a name="input_frontend_domain"></a> [frontend\_domain](#input\_frontend\_domain) | n/a | `any` | n/a | yes |
| <a name="input_frontend_ip"></a> [frontend\_ip](#input\_frontend\_ip) | n/a | `any` | n/a | yes |

## Outputs

No outputs.
<!-- END_TF_DOCS -->