<!-- BEGIN_TF_DOCS -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_google"></a> [google](#provider\_google) | n/a |
| <a name="provider_google-beta"></a> [google-beta](#provider\_google-beta) | n/a |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [google-beta_google_compute_managed_ssl_certificate.frontend_certificate](https://registry.terraform.io/providers/hashicorp/google-beta/latest/docs/resources/google_compute_managed_ssl_certificate) | resource |
| [google-beta_google_compute_target_https_proxy.frontend_https_proxy](https://registry.terraform.io/providers/hashicorp/google-beta/latest/docs/resources/google_compute_target_https_proxy) | resource |
| [google-beta_google_compute_url_map.frontend_url_map](https://registry.terraform.io/providers/hashicorp/google-beta/latest/docs/resources/google_compute_url_map) | resource |
| [google-beta_google_storage_bucket.frontend](https://registry.terraform.io/providers/hashicorp/google-beta/latest/docs/resources/google_storage_bucket) | resource |
| [google_cloudbuild_trigger.github_push_trigger](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/cloudbuild_trigger) | resource |
| [google_compute_backend_bucket.frontend_backend_service](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_backend_bucket) | resource |
| [google_compute_global_address.frontend_ip](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_global_address) | resource |
| [google_compute_global_forwarding_rule.frontend_forwarding_rule](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_global_forwarding_rule) | resource |
| [google_compute_global_forwarding_rule.http-redirect](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_global_forwarding_rule) | resource |
| [google_compute_target_http_proxy.http-redirect](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_target_http_proxy) | resource |
| [google_compute_url_map.http-redirect](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_url_map) | resource |
| [google_storage_bucket_iam_member.member](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/storage_bucket_iam_member) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_acls"></a> [acls](#input\_acls) | Bucket ACL rules | `list(string)` | <pre>[<br>  "READER:allUsers"<br>]</pre> | no |
| <a name="input_cloud_build_filename"></a> [cloud\_build\_filename](#input\_cloud\_build\_filename) | Cloud build default filename | `string` | `"website/cloudbuild.yaml"` | no |
| <a name="input_cloud_build_name"></a> [cloud\_build\_name](#input\_cloud\_build\_name) | Cloud build default name | `string` | `"frontend-cloud-build"` | no |
| <a name="input_cors_headers"></a> [cors\_headers](#input\_cors\_headers) | List of allowed headers for CORS | `list(string)` | <pre>[<br>  "*"<br>]</pre> | no |
| <a name="input_cors_max_age"></a> [cors\_max\_age](#input\_cors\_max\_age) | Value in seconds of max-age header for CORS preflight | `number` | `3600` | no |
| <a name="input_cors_methods"></a> [cors\_methods](#input\_cors\_methods) | List of allowed methods for CORS | `list(string)` | <pre>[<br>  "GET",<br>  "PUT",<br>  "POST",<br>  "DELETE"<br>]</pre> | no |
| <a name="input_cors_origins"></a> [cors\_origins](#input\_cors\_origins) | List of allowed origins for CORS | `list(string)` | <pre>[<br>  "*"<br>]</pre> | no |
| <a name="input_frontend_domain"></a> [frontend\_domain](#input\_frontend\_domain) | n/a | `any` | n/a | yes |
| <a name="input_location"></a> [location](#input\_location) | n/a | `any` | n/a | yes |
| <a name="input_project"></a> [project](#input\_project) | n/a | `any` | n/a | yes |
| <a name="input_repo_suffix"></a> [repo\_suffix](#input\_repo\_suffix) | n/a | `any` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_frontend_ip"></a> [frontend\_ip](#output\_frontend\_ip) | n/a |
<!-- END_TF_DOCS -->