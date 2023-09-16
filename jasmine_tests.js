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

describe("Parse Command Input", function() {
  var inputString="create test@test.com firstName=john lastName=smith mobilePhone=423-222-342 preferredLanguage=Russian"
  var outputObject={"profile":{"firstName":"john","lastName":"smith","mobilePhone":"423-222-342","preferredLanguage":"Russian","email":"test@test.com","login":"test@test.com"}}
  var generatedObject

  it("object parsed", function() {
    generatedObject=oktaConnect.generateProfileUniversal(inputString)

    expect(generatedObject).toEqual(outputObject);
  });
});

describe("Parse Array", function() {
  var inputString="create test@test.com firstName=john lastName=smith mobilePhone=423-222-324 preferredLanguage=Russian"
  var outputArray=["test@test.com","firstName=john","lastName=smith","mobilePhone=423-222-324","preferredLanguage=Russian"]
  var generatedArray

  it("array parsed", function() {
    generatedArray=oktaConnect.generateProfileQuery(inputString)

    expect(generatedArray).toEqual(outputArray);
  });
});
