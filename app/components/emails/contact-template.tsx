import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface ContactFormEmailProps {
  message: string;
  senderEmail: string;
  subject: string;
}

export const ContactFormEmail = ({
  message,
  senderEmail,
  subject,
}: ContactFormEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New message from {senderEmail}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 text-black font-sans my-auto mx-auto px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-10 mx-auto p-5 max-w-[465px] bg-white">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              New Contact Message
            </Heading>

            <Text className="text-[14px] leading-6 text-black">
              You have received a new message from your website contact form.
            </Text>

            <Section className="px-4 py-2 bg-gray-50 rounded border border-gray-200 my-4">
              <Text className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                From
              </Text>
              <Text className="text-base font-medium text-gray-800 mt-0 mb-4">
                {senderEmail}
              </Text>

              <Text className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Subject
              </Text>
              <Text className="text-base font-medium text-gray-800 mt-0">
                {subject}
              </Text>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

            <Text className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Message
            </Text>
            <Text className="text-[14px] leading-6 text-black whitespace-pre-wrap">
              {message}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ContactFormEmail;
