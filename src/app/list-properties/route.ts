import { NextResponse } from 'next/server';

// Temporary development route to accept listing payloads from the frontend.
// In production, replace this with your backend endpoint that authenticates the user,
// stores metadata in a database, uploads files to permanent storage (IPFS/S3),
// and optionally coordinates on-chain transactions.

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation (extend as required)
    if (!body || !body.name || !body.location) {
      return NextResponse.json({ error: 'Missing required fields: name or location' }, { status: 400 });
    }

    // TODO: authenticate the request and attach owner information (server-side)
    // TODO: persist to database
    // TODO: upload files referenced in metadata.documents and metadata.gallery to permanent storage

    const created = {
      _id: `local_${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    };

    // Return a success response for the frontend to continue with on-chain steps.
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error('Error in /list-properties route:', err);
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
