import * as vscode from 'vscode';
import { UserLibrary, TracksResponse, PlayRequestBody, TracksType, PlaylistTrackObject } from './types';

const BASE_URL = 'http://localhost:8282'; 

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    try {
        const response = await fetch(`${BASE_URL}${url}`, options);

        if (!response.ok) {
            let errorText = `HTTP error! Status: ${response.status}`;
            try {
                const errorBody = await response.json();
                errorText += ` - ${JSON.stringify(errorBody)}`;
            } catch (jsonError) {
            }
            throw new Error(errorText);
        }

        return (await response.json()) as T;
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to fetch from ${url}: ${error.message}`);
        throw error;
    }
}

export async function getLibrary(): Promise<UserLibrary> {
    return request<UserLibrary>('/library');
}

export async function getTracks(id: string, type: TracksType): Promise<TracksResponse> {
    return request<TracksResponse>(`/tracks?id=${id}&type=${type}`);
}

export async function playTrack(body: PlayRequestBody): Promise<any> {
    return request<any>('/player/play', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
}

export async function togglePlayPause(): Promise<any> {
    return request<any>('/player');
}

export async function searchTracks(query: string): Promise<PlaylistTrackObject[]> {
    console.log(`Search for: ${query}`);
    return [];
}

// TODO: Implement SSE client for /events
