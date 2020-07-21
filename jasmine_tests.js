const oktaConnect = require("./okta_connector");
describe("A suite is just a function", function() {
  var a;

  it("and so is a spec", function() {
    a = true;

    expect(a).toBe(true);
  });
});

describe("Email parser correct returns parsedEmail", function() {
  var inputEmail="<mailto:newpost@newpost.com|newpost@newpost.com>"
  var outputEmail="newpost@newpost.com"
  var processedEmail

  it("Email Test", function() {
    processedEmail=oktaConnect.deLinkEmail(inputEmail)

    expect(processedEmail).toBe(outputEmail);
  });
});

describe("Email parser correct returns parsedEmail", function() {
  var inputEmail="<mailto:newpost@newpost.com|newpost@newpost.com>"
  var outputEmail="newpost@newpost.com"
  var processedEmail

  it("Email Test", function() {
    processedEmail=oktaConnect.deLinkEmail(inputEmail)

    expect(processedEmail).toBe(outputEmail);
  });
});

