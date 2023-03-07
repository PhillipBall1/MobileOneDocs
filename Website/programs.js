NavBar();

var form = document.getElementsByName("form");
let programTitles = form[0].querySelectorAll(".programs-title");
let hiddenPrograms = form[0].querySelectorAll(".hidden-program");

SetListeners();

function SetListeners()
{
    for(let i = 0; i < programTitles.length; i++)
    {
        let programTitle = programTitles[i];
        programTitle.addEventListener('click', () => {
            ShowHideElements(programTitle);
        });
    }
}

function NavBar(){
    const toggle = document.getElementsByClassName('menu-icon')[0]

    const navbarLinks = document.getElementsByClassName('navbar-links')[0]
    
    toggle.addEventListener('click', () => 
    {
        navbarLinks.classList.toggle('active')
        
    });
}

function ShowHideElements(program)
{
    let title = program.getAttribute('name');
    for(let i = 0; i < hiddenPrograms.length; i++)
    {
        let hiddenProgram = hiddenPrograms[i];
        if(title == hiddenProgram.getAttribute('name'))
        {
            if(hiddenProgram.classList.contains("shown-program"))
            {
                //program.style.backgroundColor = "#394c6d";
                //program.style.color = "white";
                hiddenProgram.classList.remove("shown-program");
                hiddenProgram.classList.add("hidden-program");
            }
            else
            {
                //program.style.backgroundColor = "white";
                //program.style.color = "#575757";
                hiddenProgram.classList.remove("hidden-program");
                hiddenProgram.classList.add("shown-program");
            }
        }   
    }
}