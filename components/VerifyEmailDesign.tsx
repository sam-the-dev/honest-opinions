import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";
import { EmailTemplateProps } from "@/lib/schema-types";

export const VerificationEmailDesign = ({
  username,
  verificationCode,
}: EmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Body className="bg-white font-sans">
        <Container className="bg-white border border-gray-200 rounded-md shadow-md mt-20 max-w-md mx-auto p-6">
          <Text className="text-blue-600 uppercase font-bold text-sm text-center mb-4">
            Verify Your Identity
          </Text>
          <Heading className="text-lg font-medium text-center mb-4">
          Hi {username}, here&apos;s your verification code
          </Heading>
          <Section className="bg-gray-100 rounded-md p-4 mb-4">
            <Text className="text-3xl font-bold text-center">{verificationCode}</Text>
          </Section>
          <Text className="text-gray-600 text-sm text-center mb-4">
            Not expecting this email?
          </Text>
          <Text className="text-gray-600 text-sm text-center mb-4">
            Contact{" "}
            <Link href="mailto:thedev.sam09@gmail.com" className="underline text-gray-600">
              thedev.sam09@gmail.com
            </Link>{" "}
            if you did not request this code.
          </Text>
        </Container>
        <Text className="text-gray-800 uppercase font-bold text-sm text-center mt-20">
          Securely powered by Honest Opinions.
        </Text>
      </Body>
    </Html>
  );
};