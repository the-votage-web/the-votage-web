import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const recipientEmail =
      process.env.BABY_DEDICATION_EMAIL || 'admin@thevotagechurch.org';

    // Log the submission payload for auditing and debugging
    console.log('----------------------------------------------------');
    console.log('👶 NEW BABY DEDICATION SUBMISSION');
    console.log('Target Notification Email:', recipientEmail);
    console.log('Timestamp:', new Date().toISOString());
    console.log('Baby Name:', data.babyName);
    console.log('Gender:', data.babyGender);
    console.log('Date of Birth:', data.babyDob);
    console.log(
      "Parents:",
      `${data.fatherFirstName} ${data.fatherLastName} & ${data.motherFirstName} ${data.motherLastName}`
    );
    console.log('Father Phone:', data.fatherPhone);
    console.log('Parent Email:', data.parentEmail);
    console.log('Campus:', data.campus);
    console.log('Social Media:', data.socialMedia);
    console.log(
      'Cell Leader:',
      `${data.cellLeaderFirstName || ''} ${data.cellLeaderLastName || ''}`.trim() || 'N/A'
    );
    console.log('Attachment Provided:', !!data.hasAttachment);
    console.log('----------------------------------------------------');

    return NextResponse.json({
      status: 'success',
      message: 'Baby dedication request logged successfully',
      recipient: recipientEmail,
    });
  } catch (error: any) {
    console.error('Baby dedication API route error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error?.message || 'Failed to process baby dedication request',
      },
      { status: 500 }
    );
  }
}
