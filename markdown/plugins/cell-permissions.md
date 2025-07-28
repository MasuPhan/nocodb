# Cell Permission Matrix

This feature allows defining permissions per cell using a matrix of **role**, **row** and **column**. Rules are stored in the `nc_permissions` table.

## Example Matrix

| Role  | Row ID | Column ID | Permission |
|-------|-------|-----------|------------|
| owner | r1    | c1        | EDIT       |
| viewer| r1    | c1        | VIEW       |

The matrix above grants owners edit access while viewers can only view that cell.

Use the following endpoints to manage permissions:

- `POST /api/v1/db/meta/cell-permissions` – create or update a rule
- `GET /api/v1/db/meta/cell-permissions?rowId=...&columnId=...&role=...` – check access
- `DELETE /api/v1/db/meta/cell-permissions/:id` – remove a rule

The `AclMiddleware` checks these rules for `dataRead` and `dataUpdate` requests.
