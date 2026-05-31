import { useAnalytics } from '../analytics/provider';
import { trackPrivacyModalClick } from '../analytics/events';
import { useT } from '../i18n';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  Banner,
  Button,
  Icon,
} from './ds/index';

/**
 * Canonical location of the full privacy policy. Kept as a single named
 * constant so it can be repointed (e.g. to a hosted page) without touching
 * markup. `PRIVACY.md` documents the same data handling the modal discloses.
 */
const PRIVACY_POLICY_URL = 'https://github.com/galyarderlabs/galyarder-design/blob/main/PRIVACY.md';

interface Props {
  /**
   * Acknowledges the disclosure and opts the user into telemetry. The host
   * persists `privacyDecisionAt` and enables the same telemetry surface the
   * previous "Share usage data" button enabled. The user can flip the toggle
   * off any time from Settings → Privacy.
   */
  onAccept: () => void;
  /**
   * Declines telemetry. The host persists `privacyDecisionAt` with telemetry
   * disabled. Optional for backwards compatibility with existing callers that
   * only pass `onAccept`; when omitted the decline button still closes the
   * modal and persists the decision via `localStorage.galyarder.privacy.consent`.
   */
  onDecline?: () => void;
}

/**
 * First-run privacy disclosure modal.
 *
 * Rendered as a non-dismissable `Dialog` (Req 18.1) so it sits above all
 * page content with a single backdrop overlay and page scroll locked. The
 * user must make an explicit accept or decline decision — Esc is suppressed
 * (Req 18.4, `dismissable={false}`).
 *
 * Three controls in tab order (Req 18.2):
 *   1. Accept — primary, affirmative verb
 *   2. Decline — secondary, negative verb
 *   3. Privacy details link — opens in new tab
 *
 * The decision is persisted to `localStorage.galyarder.privacy.consent`
 * (Req 18.3) so subsequent loads skip the modal.
 *
 * Focus is trapped inside the dialog while open; initial focus lands on the
 * first interactive control (Accept); focus returns to the opener on close
 * (Req 18.4).
 *
 * @example
 *   <PrivacyConsentModal
 *     onAccept={() => persistDecision('accepted')}
 *     onDecline={() => persistDecision('declined')}
 *   />
 */
export function PrivacyConsentModal({ onAccept, onDecline }: Props): JSX.Element {
  const t = useT();
  const analytics = useAnalytics();

  function handleAccept(): void {
    trackPrivacyModalClick(analytics.track, {
      page_name: 'home',
      area: 'privacy_modal',
      element: 'yes',
    });
    try {
      localStorage.setItem('galyarder.privacy.consent', 'accepted');
    } catch {
      // localStorage may be unavailable in some environments; proceed anyway.
    }
    onAccept();
  }

  function handleDecline(): void {
    trackPrivacyModalClick(analytics.track, {
      page_name: 'home',
      area: 'privacy_modal',
      element: 'no',
    });
    try {
      localStorage.setItem('galyarder.privacy.consent', 'declined');
    } catch {
      // localStorage may be unavailable in some environments; proceed anyway.
    }
    if (onDecline) {
      onDecline();
    }
  }

  return (
    <Dialog open modal>
      {/*
       * dismissable={false}: Esc and outside-click are suppressed so the
       * user must commit through Accept or Decline (Req 18.4). Focus trap
       * and initial-focus-on-first-control are handled by Radix FocusScope
       * inside DialogContent. Focus returns to the opener on close.
       */}
      <DialogContent
        size="sm"
        dismissable={false}
      >
        <DialogTitle>
          {t('settings.privacyConsentKicker')}
        </DialogTitle>

        <DialogDescription>
          {t('settings.privacyConsentLead')}
        </DialogDescription>

        <Banner
          variant="info"
          description={t('settings.privacyConsentBannerFooter')}
        />

        {/*
         * Actions in required tab order: Accept → Decline → Privacy link
         * (Req 18.2). The row uses token-based gap so density-multiplier
         * propagates through.
         */}
        <div className="privacy-consent-modal-actions">
          <Button
            variant="primary"
            size="md"
            onClick={handleAccept}
          >
            {t('settings.privacyConsentAccept')}
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleDecline}
          >
            {t('settings.privacyConsentDecline')}
          </Button>
        </div>

        {/* Privacy details link — third in tab order (Req 18.2) */}
        <a
          className="privacy-consent-modal-policy-link ds-focus-ring"
          href={PRIVACY_POLICY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="ExternalLink" size={16} strokeWidth={1.5} />
          <span>{t('settings.privacyConsentPolicyLink')}</span>
        </a>
      </DialogContent>
    </Dialog>
  );
}
