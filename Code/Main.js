let fs = require("fs");
let axios = require("axios");
let jsdom = require("jsdom");
let excel = require("excel4node");
let path = require("path");
let nodemailer = require("nodemailer");

let wb = new excel.Workbook();
function main() {
  url2 = "https://internshala.com/internships/internship-in-bangalore/page-1";
  intershala(url2);

  url1 =
    "https://jobbuzz.timesjobs.com/jobbuzz/loadMoreJobs.json?companyIds=&locationnames=198130$&aosValues=&sortby=Y&from=filter&faids=&txtKeywords=&pSize=50";
  timesjob(url1);

  setTimeout(() => send(), 8000);

function send(){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'EnterYourEmail@gmail.com',
          pass: '***********'
        }
      });
      
      var mailOptions = {
        from: 'EnterYourEmail@gmail.com',
        to: 'EnterRecipientEmail@gmail.com',
        subject: 'Sending Email using Node.js',
        text: `Hi Smartherd, thank you for your awsome job scrapper.
              Thankyou to rahul and whole NADOS team for this opportunity.`,
        attachments: [
            {
                filename: 'JOB.csv',
                path: __dirname + '/JOB.csv',
                cid: 'uniq-JOB.csv'
            }
        ]      
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

}

function timesjob(url) {
  let responsePromise = axios.get(url);
  responsePromise.then(function (response) {
    let jsonJob = response.data;
    jsonJob = jsonJob.jobsList;
    let jobsList = [];
    for (let i = 0; i < jsonJob.length; i++) {
      let job = {
        title: "",
        applylink: "",
        jd: "",
        companyname: "",
        location: "",
        experience: "",
        salary: "",
        type: "",
        skills: "",
        startdate: "",
        enddate: "",
        source: "",
      };
      job.title = jsonJob[i].title;
      job.applylink = "http://www.timesjobs.com/candidate/" + jsonJob[i].jdUrl;

      job.jd = jsonJob[i].jobDesc;
      job.companyname = jsonJob[i].companyName;
      job.location = jsonJob[i].Location;
      job.salary = jsonJob[i].lowsalary + " - " + jsonJob[i].highsalary;
      let skill = "";
      for (let j = 0; j < jsonJob[i].keySkills.length; j++) {
        skill = jsonJob[i].keySkills[j] + "," + skill;
      }
      job.skills = skill;
      job.enddate = jsonJob[i].expiry;
      job.source = "timesjobs";
      job.experience = jsonJob[i].experience + " yrs";

      jobsList.push(job);
    }
    let timesJobJSON = JSON.stringify(jobsList);
    fs.writeFileSync("timesJob.json", timesJobJSON, "utf-8");
    prepareExcel(jobsList, "JOB.csv");
  });
}

function prepareExcel2(list, fileName) {
  let tsheet = wb.addWorksheet("InternShalaJobs");

  for (let i = 0; i < list.length; i++) {
    tsheet.cell(1, 1).string("Company Name");
    tsheet.cell(1, 2).string("Apply Link");
    tsheet.cell(1, 3).string("Job Description");
    tsheet.cell(1, 4).string("Title");
    tsheet.cell(1, 5).string("Location");
    tsheet.cell(1, 6).string("Experience");
    tsheet.cell(1, 7).string("Salary");
    tsheet.cell(1, 8).string("Type");
    tsheet.cell(1, 9).string("Skills");
    tsheet.cell(1, 10).string("Startdate");
    tsheet.cell(1, 11).string("Enddate");
    tsheet.cell(1, 12).string("Source");
    tsheet.cell(2 + i, 1).string(list[i].companyname);
    tsheet.cell(2 + i, 2).link(list[i].applylink, ["click_here"]);
    tsheet.cell(2 + i, 3).string(list[i].jd);
    tsheet.cell(2 + i, 4).string(list[i].title);
    tsheet.cell(2 + i, 5).string(list[i].location);
    tsheet.cell(2 + i, 6).string(list[i].experience);
    tsheet.cell(2 + i, 7).string(list[i].salary);
    tsheet.cell(2 + i, 8).string(list[i].type);
    tsheet.cell(2 + i, 9).string(list[i].skills);
    tsheet.cell(2 + i, 10).string(list[i].startdate);
    tsheet.cell(2 + i, 11).string(list[i].enddate);
    tsheet.cell(2 + i, 12).string(list[i].source);
  }
  wb.write(fileName);
}
function prepareExcel(list, fileName) {
  let tsheet = wb.addWorksheet("TimesJobs");

  for (let i = 0; i < list.length; i++) {
    tsheet.cell(1, 1).string("Company Name");
    tsheet.cell(1, 2).string("Apply Link");
    tsheet.cell(1, 3).string("Job Description");
    tsheet.cell(1, 4).string("Title");
    tsheet.cell(1, 5).string("Location");
    tsheet.cell(1, 6).string("Experience");
    tsheet.cell(1, 7).string("Salary");
    tsheet.cell(1, 8).string("Type");
    tsheet.cell(1, 9).string("Skills");
    tsheet.cell(1, 10).string("Startdate");
    tsheet.cell(1, 11).string("Enddate");
    tsheet.cell(1, 12).string("Source");
    tsheet.cell(2 + i, 1).string(list[i].companyname);
    tsheet.cell(2 + i, 2).link(list[i].applylink, ["click_here"]);
    tsheet.cell(2 + i, 3).string(list[i].jd);
    tsheet.cell(2 + i, 4).string(list[i].title);
    tsheet.cell(2 + i, 5).string(list[i].location);
    tsheet.cell(2 + i, 6).string(list[i].experience);
    tsheet.cell(2 + i, 7).string(list[i].salary);
    tsheet.cell(2 + i, 8).string(list[i].type);
    tsheet.cell(2 + i, 9).string(list[i].skills);
    tsheet.cell(2 + i, 10).string(list[i].startdate);
    tsheet.cell(2 + i, 11).string(list[i].enddate);
    tsheet.cell(2 + i, 12).string(list[i].source);
  }
  wb.write(fileName);
}

function intershala(link) {
  let url = axios.get(link);
  url.then(function (response) {
    let html = response.data;

    let dom = new jsdom.JSDOM(html);
    let document = dom.window.document;

    let container = document.querySelectorAll(
      ".container-fluid .individual_internship"
    );

    let jobs = [];

    for (let i = 0; i < container.length; i++) {
      let job = {
        title: "",
        applylink: "",
        jd: "",
        companyname: "",
        location: "",
        experience: "",
        salary: "",
        type: "",
        skills: "",
        startdate: "",
        enddate: "",
        source: "",
      };

      let arr = [
        "AWS",
        "Deveops",
        "DSA",
        "Cloud",
        "MERN",
        "Software development",
        "Web development",
        "Backend",
        "Frontend",
        "Sales",
      ];

      job.title = container[i].querySelector("a").textContent;

      job.applylink =
        "https://internshala.com" +
        container[i].querySelector("a").getAttribute("href");

      let company_container = container[i].querySelectorAll(
        "a.link_display_like_text"
      );

      job.companyname = company_container[0].textContent.trim();

      let location_container = container[i].querySelectorAll("a.location_link");

      job.location = location_container[0].textContent;

      let stipend_container = container[i].querySelectorAll("span.stipend");

      job.salary = stipend_container[0].textContent;

      let type_container = container[i].querySelectorAll(
        "div.label_container.label_container_desktop"
      );

      job.type = type_container[0].textContent.trim();

      let start_container = container[i].querySelectorAll(
        "div#start-date-first"
      );

      job.startdate = start_container[0].textContent.trim();

      let apply_by_container = container[i].querySelectorAll(
        "div.other_detail_item > div.item_body"
      );

      job.enddate = apply_by_container[1].textContent.trim();

      job.jd = "Basic IT Knowledge and " + arr[i % 10];

      job.source = "internshala";
      job.experience = "Fresher";
      job.location = "Bengaluru";

      job.skills = "communication skills";

      jobs.push(job);
    }

    let intershalaJobJSON = JSON.stringify(jobs);
    fs.writeFileSync("IntershalaJob.json", intershalaJobJSON, "utf-8");

    prepareExcel2(jobs, "JOB.csv");
  });
}

//calling function
main(); 
