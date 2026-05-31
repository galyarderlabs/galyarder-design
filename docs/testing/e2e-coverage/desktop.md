# Desktop module

## Coverage

- Mac desktop smoke gated by an environment variable
- Mac packaged-build install / launch / health / lifecycle
- Critical path from the desktop shell into the settings page

## Test files

- `e2e/specs/mac.spec.ts`

## Automated

### Desktop shell smoke

| ID | Scenario | Gate | Source |
| --- | --- | --- | --- |
| DESK-001 | The desktop shell opens the current API configuration and shows the correct provider/model | `GD_DESKTOP_SMOKE=1` | `mac.spec.ts` |
| DESK-002 | Switching the API protocol inside desktop settings keeps legacy provider tracking consistent | `GD_DESKTOP_SMOKE=1` | `mac.spec.ts` |
| DESK-003 | Desktop appearance settings preview Dark mode and persist after save | `GD_DESKTOP_SMOKE=1` | `mac.spec.ts` |

### Packaged-runtime smoke

| ID | Scenario | Gate | Source |
| --- | --- | --- | --- |
| DESK-101 | The built mac installer completes install, launch, health check, stop, and uninstall | `GD_PACKAGED_E2E_MAC=1` | `mac.spec.ts` |

## Automation candidates

| ID | Scenario | Reason |
| --- | --- | --- |
| DESK-C01 | Windows desktop smoke | Worth adding once the matching platform smoke file and execution infra are ready |
| DESK-C02 | More desktop settings sections, e.g. notifications, language, connectors | Automation-worthy, but high-ROI core paths come first |
| DESK-C03 | Deeper packaged-runtime verification | Higher cost; expand once the release pipeline is stabler |

## Manual retained

| ID | Scenario | Reason |
| --- | --- | --- |
| DESK-M01 | Real-machine install experience and system permission dialogs | Strong dependency on real hardware and human judgment |
| DESK-M02 | UI detail and interaction feel across macOS versions | Automation cost is high; manual regression is a better fit |

## Notes

- Desktop smoke is intentionally folded into `e2e/specs/mac.spec.ts` so executable coverage stays in the existing platform-smoke layer.
- `e2e/lib/desktop/**` is helpers only; no standalone executable cases live there.
