import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
  } from '@react-email/components';
  
  interface ForgotPasswordEmailProps {
    username: string;
    resetCode: string;
  }
  
  export default function ForgotPasswordEmail({ username, resetCode }: ForgotPasswordEmailProps) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Password Reset Code</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Arial" // Single fallback font
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>Reset your password with this code: {resetCode}</Preview>
        <Section style={{ fontFamily: 'Roboto, Arial, sans-serif', lineHeight: '1.6' }}>
          <Row>
            <Heading as="h2" style={{ fontSize: '24px', marginBottom: '20px' }}>
              Hello {username},
            </Heading>
          </Row>
          <Row>
            <Text>
              We received a request to reset your password. Please use the following code to complete the process:
            </Text>
          </Row>
          <Row>
            <Text
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                textAlign: 'center',
                margin: '20px 0',
                color: '#4CAF50',
              }}
            >
              {resetCode}
            </Text>
          </Row>
          <Row>
            <Text>
              This code will expire in 15 minutes. If you did not request this reset, you can safely ignore this email.
            </Text>
          </Row>
          <Row>
            <Text style={{ marginTop: '20px' }}>
              If you need further assistance, please contact our support team.
            </Text>
          </Row>
          <Row>
            <Text style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
              Thank you, <br />
              The MentorVerse Team
            </Text>
          </Row>
        </Section>
      </Html>
    );
  }
  