/**
 * Matomo Analytics Type Definitions
 * Based on Matomo JavaScript Tracking Client API
 * @see https://developer.matomo.org/api-reference/tracking-javascript
 */

// Event tracking commands
type TrackEventCommand = ['trackEvent', string, string, string?, number?];
type TrackPageViewCommand = ['trackPageView', string?];
type TrackLinkCommand = ['trackLink', string, 'link' | 'download', object?];

// Configuration commands
type SetTrackerUrlCommand = ['setTrackerUrl', string];
type SetSiteIdCommand = ['setSiteId', number | string];
type DisableCookiesCommand = ['disableCookies'];
type SetDoNotTrackCommand = ['setDoNotTrack', boolean];
type EnableLinkTrackingCommand = ['enableLinkTracking', boolean?];

// Union of all supported Matomo commands
export type MatomoCommand =
    | TrackEventCommand
    | TrackPageViewCommand
    | TrackLinkCommand
    | SetTrackerUrlCommand
    | SetSiteIdCommand
    | DisableCookiesCommand
    | SetDoNotTrackCommand
    | EnableLinkTrackingCommand;

// Global window augmentation
declare global {
    interface Window {
        _paq?: MatomoCommand[];
    }
}
