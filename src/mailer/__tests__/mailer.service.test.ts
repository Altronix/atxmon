import { MailerService } from "../mailer.service";
import getMockUtils from "../../common/__tests__/__mocks__/utils.mock";
import * as sg from "@sendgrid/mail";
jest.mock("@sendgrid/mail");

function setup() {
  let mockUtils = getMockUtils();
  let mockMailer = sg as jest.Mocked<typeof sg>;
  let mailer = new MailerService(mockMailer, mockUtils);
  return { mailer, mockUtils, mockMailer };
}

test("mailer.service should init", async () => {
  let { mockMailer, mailer } = setup();
  mailer.init("foo");
  expect(mockMailer.setApiKey).toBeCalledWith("foo");
});

test("mailer.service should send", async () => {
  let { mockMailer, mailer } = setup();
  const testMail = {
    to: "foo@mail.com",
    from: "",
    text: "",
    html: "",
    subject: "a subject"
  };
  mailer.send(testMail);
  expect(mockMailer.send).toBeCalledWith([testMail]);
});

test("mailer.service should send", async () => {
  let { mockMailer, mailer } = setup();
  const testMail = [
    {
      to: "foo@mail.com",
      from: "",
      text: "",
      html: "",
      subject: "a subject"
    }
  ];
  mailer.send(testMail);
  expect(mockMailer.send).toBeCalledWith(testMail);
});
