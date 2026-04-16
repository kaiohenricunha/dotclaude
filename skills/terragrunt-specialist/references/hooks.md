# Hooks

## Key Concepts

- **`before_hook`**: runs a shell command before Terraform executes; use for formatting, validation, secret injection
- **`after_hook`**: runs after Terraform exits (success or failure); use for notifications, cleanup, artifact upload
- **`error_hook`**: runs only when Terraform exits with a non-zero code; use for incident alerting or rollback scripts
- **`commands`**: list of Terraform sub-commands that activate the hook (e.g., `["apply", "plan"]`); hooks only fire for listed commands
- **`run_on_error`**: boolean on `after_hook`; when `true`, the hook runs even if Terraform failed

## Common Patterns

**Pre-plan validation**:

```hcl
before_hook "validate" {
  commands = ["plan", "apply"]
  execute  = ["terraform", "validate"]
}
```

**Secret injection before apply**:

```hcl
before_hook "inject_secrets" {
  commands = ["apply"]
  execute  = ["bash", "-c", "eval $(aws-vault exec $VAULT_PROFILE -- env | grep AWS_)"]
}
```

**Notify on error**:

```hcl
error_hook "alert_on_failure" {
  commands  = ["apply"]
  execute   = ["bash", "-c", "curl -X POST $SLACK_WEBHOOK -d '{\"text\":\"Terragrunt apply failed in ${get_terragrunt_dir()}\"}'"]
  run_on_error = true
}
```

**`after_hook` for plan artifact**:

```hcl
after_hook "save_plan" {
  commands     = ["plan"]
  execute      = ["bash", "-c", "terraform show -json .terraform/plan.tfplan > plan.json"]
  run_on_error = false
}
```

## Checklist

- [ ] Hooks scoped to the correct `commands` list (not left as `["*"]`)
- [ ] `before_hook` validation runs on both `plan` and `apply`
- [ ] `error_hook` does not retry apply — only alerts or rolls back
- [ ] Secret injection hooks use short-lived credentials, not long-lived keys
- [ ] Hook scripts are idempotent — safe to run multiple times
- [ ] No sensitive values echoed or logged in hook `execute` commands

## Gotchas

**Hook failures abort the Terraform command.** If a `before_hook` exits non-zero, Terraform never runs. A flaky validation hook (e.g., one that calls an unavailable endpoint) will silently block all applies. Add error handling (`|| true`) only for truly non-critical hooks; for critical hooks, make them robust.
