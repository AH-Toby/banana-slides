import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SettingsAbout } from '@/pages/Settings';

vi.mock('@/utils/appVersion', () => ({
  appVersion: {
    display: 'v9.9.9',
    detail: 'v9.9.9 (abcdef1234567890)',
  },
}));

const labels: Record<string, string> = {
  'settings.sections.about': '关于',
  'settings.about.version': '当前版本',
  'settings.about.source': 'GitHub 项目',
};

describe('SettingsAbout', () => {
  it('shows the current app version in settings', () => {
    render(<SettingsAbout t={(key: string) => labels[key] || key} />);

    expect(screen.getByText('关于')).toBeInTheDocument();
    expect(screen.getByText('当前版本: v9.9.9')).toBeInTheDocument();
    expect(screen.getByLabelText('当前版本 v9.9.9 (abcdef1234567890)')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'GitHub 项目' })).toHaveAttribute('href', 'https://github.com/Anionex/banana-slides');
  });
});
