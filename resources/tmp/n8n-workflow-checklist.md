# n8n Workflow Creation Checklist

Run these steps in order before any workflow goes live. Skip nothing.

## 1. Build
- [ ] Search nodes with `n8n_search_nodes` — don't guess node IDs
- [ ] Get node types with `n8n-mcp_get_node_types` — never guess parameter names
- [ ] Use `n8n_get_node` with `mode="docs"` for readable parameter docs
- [ ] Validate each node config with `n8n_validate_node` before wiring

## 2. Wire
- [ ] Connections use node **names** (not IDs, not numeric keys)
- [ ] No duplicate connections between same node pairs
- [ ] All trigger nodes, credential nodes, and HTTP Request nodes have pin data or real credentials

## 3. Test
- [ ] Generate pin data with `n8n-mcp_prepare_test_pin_data`
- [ ] Run test with `n8n-mcp_test_workflow` using pin data
- [ ] Check execution output with `n8n-mcp_get_execution` — verify data flows correctly at each node
- [ ] Test the IF/switch branches explicitly (both true and false paths)

## 4. Validate
- [ ] Run `n8n_n8n_validate_workflow` on the full workflow JSON
- [ ] Fix all errors. Review warnings. Apply suggestions if relevant.
- [ ] If validation fails, try `n8n_n8n_autofix_workflow` with `applyFixes=false` first to preview

## 5. Deploy
- [ ] Create with `n8n_n8n_create_workflow` (starts inactive)
- [ ] Publish with `n8n-mcp_publish_workflow`
- [ ] Verify active status with `n8n_n8n_get_workflow` mode="minimal"

## 6. Post-Deploy
- [ ] Run a production test via `n8n_n8n_test_workflow` (webhook/form/chat triggers only)
- [ ] Check execution with `n8n_n8n_executions` action="list"
- [ ] If errors: `n8n_n8n_executions` action="get" mode="error" on the failing execution

## Common Pitfalls (logged from real bugs)

| Issue | Fix |
|---|---|
| IF node v2.3 validation fails | Add `singleValue: true` to operator, include `options` with `version: 2` |
| `patchNodeField` can't find array index | Use dot notation: `assignments.assignments.0.value` not `assignments.assignments[0].value` |
| Schedule trigger blocks external API | Use `n8n-mcp_test_workflow` with pin data instead of `n8n_n8n_test_workflow` |
| Docker Hub "latest" tag returns "latest" not version | Filter tags with regex: `/^[0-9]+\.[0-9]+\.[0-9]+$/` |
| Telegram chatId placeholder | Always replace `YOUR_CHAT_ID` with real ID before publishing |
| Script paths in alerts | Use actual paths on the server, not assumed paths |
