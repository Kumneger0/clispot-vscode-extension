import * as vscode from 'vscode';
import { UserLibrary, TracksResponse, PlayRequestBody, TracksType, PlaylistTrackObject, SearchResponse } from './types/types.js';

const BASE_URL = 'http://localhost:8282'; 

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    try {
        const response = await fetch(`${BASE_URL}${url}`, options);
        if (!response.ok) {
            console.log("response status", response.status);
            let errorText = `HTTP error! Status: ${response.status}`;
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


export async function Search(query:string): Promise<SearchResponse> {
    return request<SearchResponse>(`/search?q=${query}`);
}
