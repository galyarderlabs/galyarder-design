# apps/packaged

Thin packaged Electron runtime entry for Galyarder Design.

This package starts the packaged daemon and web sidecars, registers the `gd://`
entry protocol, and then delegates to `@galyarder-design/desktop/main` for the host
window. Product logic stays in `apps/daemon`, `apps/web`, and `apps/desktop`.
