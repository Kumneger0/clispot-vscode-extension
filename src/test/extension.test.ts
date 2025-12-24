import * as assert from 'assert';
import * as vscode from 'vscode';
import * as api from '../api';
import {
  createMockFetch,
  createMockResponse,
  createMockErrorResponse,
  createMockLibraryResponse,
  createMockTracksResponse,
  createMockSearchResponse,
  createMockPlaylistTrackObject,
  createMockTrack
} from './helpers';
import { PlayRequestBody } from '../types/types';

suite('Extension API Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  const mockFetch = createMockFetch();

  setup(() => {
    mockFetch.mock(async (url) => {
      return createMockErrorResponse('Not Found', 404);
    });
  });

  teardown(() => {
    mockFetch.restore();
  });

  test('getLibrary should return user library on success', async () => {
    const mockData = createMockLibraryResponse();
    mockFetch.mock(async (url) => {
      assert.ok(url.endsWith('/library'), 'URL should end with /library');
      return createMockResponse(mockData);
    });

    const library = await api.getLibrary();
    assert.deepStrictEqual(library, mockData);
  });

  test('getTracks should fetch tracks with correct parameters', async () => {
    const mockData = createMockTracksResponse(3);
    const id = 'playlist-123';
    const type = 'playlist';

    mockFetch.mock(async (url) => {
      assert.ok(url.includes('/tracks'), 'URL should include /tracks');
      assert.ok(url.includes(`id=${id}`), 'URL should include id parameter');
      assert.ok(url.includes(`type=${type}`), 'URL should include type parameter');
      return createMockResponse(mockData);
    });

    const response = await api.getTracks(id, type);
    assert.deepStrictEqual(response, mockData);
  });

  test('Search should return search results', async () => {
    const mockData = createMockSearchResponse();
    const query = 'test query';

    mockFetch.mock(async (url) => {
      assert.ok(url.includes('/search'), 'URL should include /search');
      assert.ok(url.includes(`q=${encodeURIComponent(query).replace(/%20/g, '+')}`) || url.includes(`q=${encodeURIComponent(query)}`), 'URL should include encoded query');
      return createMockResponse(mockData);
    });

    const response = await api.Search(query);
    assert.deepStrictEqual(response, mockData);
  });

  test('playTrack should send correct POST request', async () => {
    const trackBody: PlayRequestBody = {
      name: 'Test Song',
      trackID: 'track-1',
      album: 'Album',
      artists: ['Artist'],
      isSkip: false,
      queue: {
        tracks: [],
        currentIndex: 0
      }
    };

    mockFetch.mock(async (url, options) => {
      assert.ok(url.endsWith('/player/play'), 'URL should end with /player/play');
      assert.strictEqual(options?.method, 'POST', 'Method should be POST');
      assert.strictEqual(JSON.parse(options?.body as string).trackID, trackBody.trackID);
      return createMockResponse({ status: 'ok', message: 'track is now playing' });
    });

    const result = await api.playTrack(trackBody);
    assert.strictEqual(result.status, 'ok');
  });

  test('togglePlayPause should send GET request', async () => {
    mockFetch.mock(async (url, options) => {
      assert.ok(url.endsWith('/player'), 'URL should end with /player');
      return createMockResponse({ status: 'ok', action: 'paused' });
    });

    const result = await api.togglePlayPause();
    assert.strictEqual(result.action, 'paused');
  });

  test('getQueue should return queue or null on error', async () => {
    const mockQueue = {
      currently_playing: createMockPlaylistTrackObject(),
      queue: [createMockPlaylistTrackObject()]
    };

    mockFetch.mock(async (url) => {
      assert.ok(url.endsWith('/player/queue'));
      return createMockResponse(mockQueue);
    });

    const result = await api.getQueue();
    assert.deepStrictEqual(result, mockQueue);
    mockFetch.mock(async () => {
      throw new Error('Network error');
    });

    const errorResult = await api.getQueue();
    assert.strictEqual(errorResult, null);
  });

  test('addTrack should send POST request with track and index', async () => {
    const track = createMockPlaylistTrackObject();
    const index = 1;

    mockFetch.mock(async (url, options) => {
      assert.ok(url.endsWith('/player/queue/add'));
      assert.strictEqual(options?.method, 'POST');
      const body = JSON.parse(options?.body as string);
      assert.strictEqual(body.index, index);
      assert.deepStrictEqual(body.track, track);
      return createMockResponse({ status: 'success', message: 'Added' });
    });

    const result = await api.addTrack(track, index);
    assert.strictEqual(result.status, 'success');
  });

  test('removeTrackFromQueue should send DELETE request', async () => {
    const track = createMockPlaylistTrackObject();

    mockFetch.mock(async (url, options) => {
      assert.ok(url.endsWith('/player/queue/remove'));
      assert.strictEqual(options?.method, 'DELETE');
      const body = JSON.parse(options?.body as string);
      assert.deepStrictEqual(body.track, track);
      return createMockResponse({ status: 'success', message: 'Removed' });
    });

    const result = await api.removeTrackFromQueue(track);
    assert.strictEqual(result.status, 'success');
  });

  test('api functions should throw/handle errors correctly', async () => {
    mockFetch.mock(async () => {
      return createMockErrorResponse('Server Error', 500);
    });

    try {
      await api.getLibrary();
      assert.fail('Should have thrown an error');
    } catch (err: any) {
      assert.ok(err.message.includes('HTTP error! Status: 500'));
    }
  });
});
