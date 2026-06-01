// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PrivacyConsentModal } from '../../src/components/PrivacyConsentModal';
import { I18nProvider } from '../../src/i18n';

const PRIVACY_POLICY_HREF = 'https://github.com/galyarderlabs/galyarder-design/blob/main/PRIVACY.md';

function renderModal(overrides?: { onAccept?: () => void }) {
  const onAccept = overrides?.onAccept ?? vi.fn();
  render(
    <I18nProvider initial="en">
      <PrivacyConsentModal onAccept={onAccept} />
    </I18nProvider>,
  );
  return { onAccept };
}

describe('PrivacyConsentModal', () => {
  afterEach(cleanup);

  it('renders both the Accept and Decline buttons', () => {
    renderModal();
    expect(screen.getByRole('button', { name: 'I get it' })).toBeTruthy();
    expect(screen.getByRole('button', { name: "Don't share" })).toBeTruthy();
  });

  it('tells the user data sharing is on by default and toggleable in Settings', () => {
    renderModal();
    // The single-button banner replaces the binary consent picker, so the
    // disclosure must say plainly that telemetry defaults on and point the
    // user at the off switch in Settings. Without this hint the surface
    // would feel like a dark pattern.
    const footer = screen.getByText(/Data sharing is on by default/i);
    expect(footer.textContent ?? '').toMatch(/Settings/);
    expect(footer.textContent ?? '').toMatch(/Privacy/);
    expect(footer.textContent ?? '').toMatch(/turn it off any time/i);
  });

  it('exposes the privacy policy via an obvious external link', () => {
    renderModal();
    const link = screen.getByRole('link', { name: /privacy policy/i });
    expect(link.getAttribute('href')).toBe(PRIVACY_POLICY_HREF);
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel') ?? '').toContain('noopener');
  });

  it('invokes onAccept when the acknowledgement button is clicked', () => {
    const { onAccept } = renderModal();
    fireEvent.click(screen.getByRole('button', { name: 'I get it' }));
    expect(onAccept).toHaveBeenCalledTimes(1);
  });
});
