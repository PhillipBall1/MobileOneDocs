NavBar();

var forms = document.getElementsByName("forms");
var buttons = document.getElementsByName("next-button");
var buttons1 = document.getElementsByName("back-button");

let currentForm = 0;
let form = forms[currentForm];
let formInputs = form.querySelectorAll(".inputs");
let formSpans = form.querySelectorAll(".load-spans, .load-spans-complete");
let formFileLabels = form.querySelectorAll(".file-labels");
let formShowHideInputs = form.querySelectorAll("#show-and-hide");
let formFields = form.querySelectorAll(".fields");

let phoneRegex = /^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
let ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let checkComplete = false;
let completedForms = 0;
let medCount = 0;

let patientMinor = false;
let patientPOA = false;

let submitted = false;

const data = {};

ButtonListeners();

UpdateForm();

function NavBar(){
    const toggle = document.getElementsByClassName('menu-icon')[0]

    const navbarLinks = document.getElementsByClassName('navbar-links')[0]

    toggle.addEventListener('click', () => 
    {
        navbarLinks.classList.toggle('active')
    })
}

function ButtonListeners(){
    for(let i = 0; i < buttons.length; i++)
    {
        buttons[i].addEventListener('click', (event) => {
            event.preventDefault();
            ChangePageNext();
        });
    }
    
    for(let i = 0; i < buttons1.length; i++)
    {
        buttons1[i].addEventListener('click', (event) => {
            event.preventDefault();
            ChangePageBack();
          });
    }
}

function FormatPhoneNumber(phoneNumberString) 
{
    try 
    {
      var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
      var match = cleaned.match(/^(1|)?(\d{0,3})?(\d{0,3})?(\d{0,4})?$/);
      var intlCode = match[1] ? "+1 " : "";
      return [
        intlCode,
        match[2] ? "(" : "",
        match[2],
        match[3] ? ") " : "",
        match[3],
        match[4] ? "-" : "",
        match[4],
      ].join("");
    } 
    catch (err) 
    {
      return "";
    }
}

function FormatSocialSecurity(val)
{
	val = val.replace(/\D/g, '');
	val = val.replace(/^(\d{3})/, '$1-');
	val = val.replace(/-(\d{2})/, '-$1-');
	val = val.replace(/(\d)-(\d{4}).*/, '$1-$2');
	return val;
}  	

function AlertChoice(a)
{
    switch(a)
    {
        case 0:
            break;
        case 1:
            alert(`Please fill out the required fields!`);
            break;
        case 2:
            alert(`Invalid Phone Number Format`);
            break;
        case 3:
            alert(`Invalid SSN Format`);
            break;
        case 4:
            alert(`Invalid Email Format`);
            break;
        case 5:
            alert(`Please Select a File`);
            break;
    }
}

function VerifyInputs()
{
    let check = 0;
    for (let i = 0; i < formInputs.length; i++) 
    {
        let element = formInputs[i];
        if (element.required) 
        {
            if(element.parentNode.id == "show-and-hide")
            {
                if(element.parentNode.style.display != "flex") continue; 
            }
            check = RequiredInputs(element);
            if(check != 0 ) return check;
        }
        else
        {
            NonRequiredInputs(element);
        }
    }
    if(!checkComplete)
    {
        completedForms++;
        checkComplete = true;
    }
    return check;
}

function RequiredInputs(element)
{
    if(element.id == "Home Phone" || element.id == "Cell Phone")
    {
        if(!phoneRegex.test(element.value)) return 2;
    }

    if(element.id == "SSN")
    {
        if(!ssnRegex.test(element.value)) return 3;
    }

    if(element.id == "Email")
    {
        if(!emailRegex.test(element.value)) return 4;
    }

    switch (element.type) 
    {
        case "text":
        case "textarea":
        case "password":
        case "date":
            if (element.value == "") return 1;

            data[element.id] = element.value;
        break;

        case "radio":
        case "checkbox":
            if (!element.checked) return 1;

            data[element.id] = "Checked";
        break;

        case "select-one":
            if (element.selectedIndex === 0) return 1;

            data[element.id] = element.value;
        break;

        case "file":
            if(!element.files[0]) return 5;

            
        break;
    }
    return 0;
}

function NonRequiredInputs(element)
{
    switch (element.type) 
    {
        case "text":
        case "textarea":
        case "password":
        case "date":
            if (element.value.trim() != "") data[element.id] = element.value;
        break;

        case "radio":
        case "checkbox":
            if (element.checked) data[element.id] = "Checked";
        break;

        case "select-one":
            if (element.selectedIndex != 0) data[element.id] = element.value;
        break;
        
        case "file":
            if(element.files[0]) UpdateFileInputLabel(element, element.files[0].name);
        break;
    }
}

function ChangePageNext()
{
    if(currentForm == 0)
    {
        currentForm++;
        UpdateForm();
        return;
    }
    if(VerifyInputs() == 0)
    {
        checkComplete = false;
        currentForm++;
        if(currentForm == 26){
            UpdateForm();
            SubmitForm();
            return;
        }
        UpdateForm();
    }
    else
    {
        AlertChoice(VerifyInputs());
    }
}

function ChangePageBack()
{
    completedForms--;
    currentForm--;
    UpdateForm(currentForm);
}

function UpdateForm()
{
    NewForm();

    SetFormInputs();

    for(let i = 0; i < formShowHideInputs.length; i++)
    {
        formShowHideInputs[i].style.display = "none";
    }

    for(let i = 0; i < formInputs.length; i++)
    {
        let input = formInputs[i];
        SetOnChange(input);

        SetOnInputs(input);
    }
    
    UpdateSpans(); 

    UpdateSignatureLabels();

    CheckStored();
}

function NewForm()
{
    
    for(let i = 0; i < forms.length; i++)
    {
        forms[i].style.display = 'none';
    }

    forms[currentForm].style.display = 'block';
}

function SetFormInputs()
{
    form = forms[currentForm];
    fields = form.querySelectorAll(".fields");
    formInputs = form.querySelectorAll(".inputs");
    formFileLabels = form.querySelectorAll(".file-labels");
    formShowHideInputs = form.querySelectorAll("#show-and-hide");
}  

function UpdateSignatureLabels()
{
    for(let i = 0; i < formInputs.length; i++)
    {
        element = formInputs[i];
        var labelElement = form.querySelector('label[for="' + element.id + '"]');
        if(labelElement){
            if(labelElement.innerHTML.includes("Signature")){
                
                if(patientPOA)
                {
                    labelElement.innerHTML = element.required? "POA Signature *" : "POA Signature";
                }
                else if(patientMinor)
                {
                    labelElement.innerHTML = element.required? "Parent/Legal Guardian Signature *" : "Parent/Legal Guardian Signature";
                }
                else
                {
                    labelElement.innerHTML = element.required? "Signature *" : "Signature";
                }
            }
        }
        
    }
}

function UpdateSpans()
{
    if(currentForm >= 26) return;
        
    formSpans = form.querySelectorAll(".load-spans, .load-spans-complete");
    
    for(let i = 0; i < formSpans.length; i++)
    {
        formSpans[i].classList.remove("load-spans-complete");
        formSpans[i].classList.add("load-spans");
    }
    for(let i = 0; i < completedForms; i++)
    {
        formSpans[i].classList.remove("load-spans");
        formSpans[i].classList.add("load-spans-complete");
    }
}

function CheckStored()
{
    const elements = GetAllElementsInBody();
    for (let i = 0; i < elements.length; i++) 
    {
        let element = elements[i];

        if(element.id == "") continue;

        var data = localStorage.getItem(element.id);
        
        if(!data) continue;
        console.log(element.id + ": " + data);
        if(element.type == "file")
        {
            
        }
        else if(element.type == "checkbox")
        {
            element.checked = true;
        }
        else
        {
            element.value = data;
        }
    }
}

function SetOnChange(input)
{
    input.addEventListener('change', () => 
    {
        VerifyInputs();
        UpdateSpans();
    });

    if(input.type == "select-one")
    {
        input.addEventListener('change', (e) => 
        {
            if(input.id == "1:Patient a Minor")
            {
                if(input.value == "Yes")
                {
                    patientMinor = true;
                }
                else
                {
                    patientMinor = false;
                }
            }
            if(input.id == "1:Patient POA")
            {
                if(input.value == "Yes")
                {
                    patientPOA = true;
                }
                else
                {
                    patientPOA = false;
                }
            }
            const nameToHide = e.target.value;
            ShowHideElements(nameToHide);
        });
    }
}

function SetOnInputs(input)
{
    input.oninput = () => 
    {
        VerifyInputs();
        UpdateSpans();
    } 
    
    if(input.id.includes("SSN"))
    {
        input.oninput = (e) =>
        {
            e.target.value = FormatSocialSecurity(e.target.value);
        }
    }

    if(input.id == "25:Patient Medication Count")
    {
        input.oninput = (e) =>
        {
            medCount = e.target.value;
            if(medCount > 0)
            {
                ShowHideElements("Medications");
            }
        }
    }

    if(input.id.includes("Phone"))
    {
        input.oninput = (e) => 
        {
            const phoneNumber = e.target.value.replace(/\D/g, '');
            const formattedPhoneNumber =  phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            e.target.value = formattedPhoneNumber.slice(0, 12);
        }
    }

    if(input.id == "1:Patient ID"){
        input.oninput = (e) => 
        {
            UpdateFileInputLabel(input, input.files[0].name);
            data[input.id] = input.files[0];
        }
    }
    
}

function ShowHideElements(value)
{
    for(let i = 0; i < formShowHideInputs.length; i++)
    {
        let element = formShowHideInputs[i];
        if(element.getAttribute('name') == value)
        {
            element.style.display = 'flex';
            SetFormInputs();
        }
        else
        {
            element.style.display = 'none';
            SetFormInputs();
        }
    }
}

window.onbeforeunload = function() 
{
    if(!submitted){
        return "Data will be lost if you leave the page, are you sure?";
    }
    else{
        return null;
    }
};

function GetAllElementsInBody() 
{
    const bodyElements = [];

    const getAllElements = function (element) 
    {
        bodyElements.push(element);
        const children = element.children;
        for (let i = 0; i < children.length; i++) 
        {
            getAllElements(children[i]);
        }
    };
    getAllElements(document.body);
    return bodyElements;
}

function UpdateFileInputLabel(element, fileName) 
{
    var labelElement = form.querySelector('label[for="' + element.id + '"]');

    if(!labelElement) return;

    if(labelElement.getAttribute('for') == element.id)
    {
        labelElement.textContent = fileName;
    }
}

function SubmitForm()
{
    submitted = true;
    console.log(data);
}

