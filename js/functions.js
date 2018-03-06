/*
The following script enhances the usability of a web page containing an overly long
listing of students by using JavaScript to dynamically divide the contents into pages
and adding a search function to list only the students that match that search.
*/

/* This function builds a list of ten students and displays it on the page */
const showPage = (pageNumber, studentList) => {
  //Hide all students on the page
  $(studentList).hide();

  //Total length of student list
  const length = studentList.length;

  //Number of students to be displayed per page
  const studentsPerPage = 10;

  //Start with the first page
  let currentPageNumber = 1;

  //Empty array that will store the students to be displayed
  let students = [];

  //Loop through student list
  for (let i=0; i<length; i++) {

    //Increase currentPageNumber every 10th student
    if (i !== 0 && i % studentsPerPage === 0) {
      currentPageNumber++;
    }

    //If student should be on this page number
    if (currentPageNumber === pageNumber) {
      //Add students to student list
      students.push( $(studentList[i]) );
    }

  }

  //Get number of students that remain at the end of list
  const studentRemainder = length % studentsPerPage;

  //If student list has no students and number of students is not divisible by 10
  if (students.length === 0 && studentRemainder !== 0) {
    //Move to next page
    currentPageNumber++;

    //Add students to student list
    for (let i=length-studentRemainder; i<length; i++) {
      students.push(studentList[i]);
    }
  }

  //Show students on the page
  for (let i=0; i<students.length; i++) {
    $(students[i]).show();
  }

};

/* This function creates all the page links based on a list of students */
const appendPageLinks = (studentList) => {
  //Number of students on the list
  const length = studentList.length;

  //Number of students to be displayed per page
  const studentsPerPage = 10;

  //Determine how many pages for this student list
  const numberOfPages = Math.ceil( length / studentsPerPage );

  //Create page link section
  let $section = $('<section class="pagination-section"></section>');

  //Create and add links to pagination section, and make the first link active
  for (let i=0; i<numberOfPages; i++) {
    $section.append( i==0 ? `<a class="active-link">${i + 1}</a>` : `<a>${i + 1}</a>` );
  }

  //Append link section to page
  $(".page").append($section);

  /*** Event handler for page numbers ***/
  $section.on("click", (event) => {
    //Make sure a number was clicked
    if (!isNaN(event.target.text)) {
      //Get number clicked
      const pageNumber = parseInt(event.target.text);

      //Display the page for the link clicked
      showPage(pageNumber, studentList);

      //Search for currently active link and make it non active
      $(".active-link").removeAttr("class");

      //Mark link as active
      $(event.target).attr("class", "active-link");
    }

  });
}

/*The function takes a value from the input field, and compares it to each
student in the list. If that value is found inside the name or email of a student,
that student is added to a new "matched" list and displayed*/
const searchList = () => {
  //Create div for student search area
  const $studentSearch = $('<div class="student-search"></div>');

  //Create search input field
  const $input = $('<input placeholder="Search students"/>');

  //Create search button
  const $button = $('<button>Search</button>');

  //Append input and button to student-search div
  $($studentSearch).append($input);
  $($studentSearch).append($button);

  //Append student-search div to page-header div
  $(".page-header").append($studentSearch);

  //Get student list
  const $studentList = $(".student-list li");

  /*** Event handler for search button ***/
  $($button).on("click", (event) => {
    //Obtain value from student input
    const inputValue = $($input).val();

    //Execute only if input value is not empty
    if (inputValue != ""){

      //Remove previous pagination section
      $(".pagination-section").remove();

      //List of students that match the search
      const matchedStudents = [];

      //Loop over student list
      for (let i=0; i<$studentList.length; i++) {
        //Get student name
        let studentName = $($studentList.children(".student-details")[i]).children("h3").text();

        //Get student email
        let studentEmail = $($studentList.children(".student-details")[i]).children(".email").text();

        //If input value MATCHES student name OR email
        if ( studentName.toLowerCase().includes(inputValue.toLowerCase()) ||
             studentEmail.toLowerCase().includes(inputValue.toLowerCase()) ) {
          //Add student to matchedStudents array
          matchedStudents.push($studentList[i]);
        }

      }

      //Hide list of students and nav links
      $($studentList).hide();
      $(".pagination-section").hide();

      //If NO students matched
      if (matchedStudents.length === 0) {
        //Display a no matched students message
        $(".page").append('<div class="no-students"><h3>No students found :(</h3></div>');

      }
      //If there are matching students
      else {
        //Show matched students
        showPage(1, matchedStudents);

        //If more than 10 students match the search
        if (matchedStudents.length > 10){
          appendPageLinks(matchedStudents);
        }
      }

    }
  });

  /*** Event handler for clearing input text ***/
  $($input).on("click", (event) => {
    //Execute only if input has text in it
    if ( $($input).val() ) {
      //Clear input value when input is clicked
      $($input).val("");

      //Hide the no students found message
      $(".no-students").hide();

      $(".pagination-section").remove();

      //Show the entire list of students 
      showPage(1, $studentList);

      //Show the links
      appendPageLinks($studentList);
    }

  });

}
