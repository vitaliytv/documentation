import { v4 as uuidv4 } from 'uuid'
import { parseSnowplowJsTrackerMethod } from './walker'

export const LIVE_SNIPPET_TRACKER_PREFIX = 'snowplowDocs-'
/*
 * The fields that are stored in localStorage for the live snippet tracker
 * APP_ID and COLLECTOR_URL are self-explanatory, but the ID is a random UUID
 * that is generated when the user changes/sets the Collector URL or App ID
 * in the live snippet tracker settings.
 *
 * This allows the user to edit the Collector endpoint and App ID
 * as many times as they want, as we have to create a new tracker
 * every time they do so
 */
export enum LiveSnippetTrackerFields {
  ID = 'liveSnippetTrackerId',
  APP_ID = 'appId',
  COLLECTOR_ENDPOINT = 'collectorEndpoint',
}

/*
 * Returns the tracker ID in localStorage for the live snippet tracker
 */
export function getLiveSnippetTrackerId(): string | null {
  return localStorage.getItem(LiveSnippetTrackerFields.ID)
}

/*
 * Returns the app ID in localStorage for the live snippet tracker
 */
export function getLiveSnippetAppId(): string | null {
  return localStorage.getItem(LiveSnippetTrackerFields.APP_ID)
}

/*
 * Returns the collector URL in localStorage for the live snippet tracker
 */
export function getLiveSnippetCollectorUrl(): string | null {
  return localStorage.getItem(LiveSnippetTrackerFields.COLLECTOR_ENDPOINT)
}

/*
 * Sets the required fields in localStorage for the live snippet tracker
 */
export function setLiveSnippetFields({
  trackerId,
  appId,
  collectorEndpoint,
}: {
  trackerId: string
  appId: string
  collectorEndpoint: string
}) {
  localStorage.setItem(LiveSnippetTrackerFields.ID, trackerId)
  localStorage.setItem(LiveSnippetTrackerFields.APP_ID, appId)
  localStorage.setItem(
    LiveSnippetTrackerFields.COLLECTOR_ENDPOINT,
    collectorEndpoint
  )
}

/*
 * Returns the namespace for the live snippet tracker
 */
export function getLiveSnippetNamespace(): string {
  return LIVE_SNIPPET_TRACKER_PREFIX + getLiveSnippetTrackerId()
}

/*
 * Creates a new tracker ID and stores it in localStorage
 * @returns the new tracker ID
 */
export function createLiveSnippetTrackerNamespace(uuid): string {
  localStorage.setItem(LiveSnippetTrackerFields.ID, uuid)
  return LIVE_SNIPPET_TRACKER_PREFIX + uuid
}

/*
 * Returns true if all the required fields are set in localStorage
 */
export function liveSnippetsEnabled(): boolean {
  return Boolean(
    getLiveSnippetTrackerId() &&
      getLiveSnippetAppId() &&
      getLiveSnippetCollectorUrl()
  )
}

/*
 * Creates a new tracker with the fields in localStorage
 */
export function newTrackerFromLocalStorageOptions() {
  window.snowplow(
    'newTracker',
    getLiveSnippetNamespace(),
    getLiveSnippetCollectorUrl(),
    {
      appId: getLiveSnippetAppId(),
      buffer: 1,
    }
  )
}

/*
 * Creates a new tracker with the given app ID and collector URL
 * Sets APP_ID, COLLECTOR_URL and ID in localStorage
 */
export function newTrackerFromAppIdAndCollectorUrl(
  appId: string,
  collectorEndpoint: string
) {
  const trackerId: string = uuidv4()
  setLiveSnippetFields({ appId, collectorEndpoint, trackerId })
  window.snowplow(
    'newTracker',
    createLiveSnippetTrackerNamespace(trackerId),
    collectorEndpoint,
    {
      appId,
      buffer: 1,
    }
  )
}

/*
 * Attempts to parse and run the given code as a Snowplow JS tracker method
 * In future, we can make this a bit more generic as we add support for other languages,
 * but for now, this is fine
 * @param code - the code to parse and run
 */
export function runSnippet(code: string) {
  const parsedSnowplowCall = parseSnowplowJsTrackerMethod(code)

  const namespace = getLiveSnippetNamespace()
  if (namespace === null) {
    console.error(
      'Namespace not set for live snippet tracker. If this happens, please file a bug report.'
    )
    return
  }

  window.snowplow(
    parsedSnowplowCall.method + ':' + getLiveSnippetNamespace(),
    ...parsedSnowplowCall.args
  )
}

const runnableRegex = /runnable/
export function parseRunnable(metastring?: string): boolean {
  return runnableRegex.test(metastring)
}
