document.addEventListener("DOMContentLoaded", () => {
   const sections = document.querySelectorAll(".section")
   const navLinks = document.querySelectorAll("nav a")
   const modal = document.getElementById("project-modal")
   const closeButton = document.querySelector(".close-button")
   let currentImageIndex = 0
   let modalImages = []

   function initialize() {
      setupNavigation()
      loadProjects()
      setupModal()
   }

   // Gestion de la navigation dynamique entre les sections
   function setupNavigation() {
      navLinks.forEach((link) => {
         link.addEventListener("click", function (e) {
            e.preventDefault()
            const targetId = this.getAttribute("href").substring(1)
            showSection(targetId)
         })
      })
      showSection("accueil")
   }
   //Affiche la section correspondante à l'ID donné
   function showSection(id) {
      sections.forEach((section) => {
         section.classList.remove("active")
         if (section.id === id) {
            section.classList.add("active")
         }
      })

      navLinks.forEach((link) => {
         link.classList.remove("active")
         if (link.getAttribute("href").substring(1) === id) {
            link.classList.add("active")
         }
      })
   }
   //Chargement des projets à partir du fichier json
   function loadProjects() {
      fetch("data.json")
         .then((response) => response.json())
         .then((projects) => {
            const projectsContainer = document.getElementById("projects-container")
            projectsContainer.innerHTML = ""
            projects.forEach((project) => {
               const projectElement = createProjectElement(project)
               projectsContainer.appendChild(projectElement)
            })
         })
         .catch((error) => console.error("Error loading projects:", error))
   }
   //Affichage des projets récupérés
   function createProjectElement(project) {
      const projectElement = document.createElement("div")
      projectElement.classList.add("project")

      const technologies = project.technologies.map((tech) => `<li>${tech}</li>`).join("")
      projectElement.innerHTML = `
       <h3>${project.title}</h3>
       <img src="${project.cover_image}" alt="${project.title}">
       <ul class="technologies">${technologies}</ul>
     `

      projectElement.addEventListener("click", () => {
         openModal(project)
      })

      return projectElement
   }
   //Gestionnaite d'événements de la modale
   function setupModal() {
      document.getElementById("next-image").addEventListener("click", () => {
         currentImageIndex = (currentImageIndex + 1) % modalImages.length
         updateCarousel()
      })

      document.getElementById("prev-image").addEventListener("click", () => {
         currentImageIndex = (currentImageIndex - 1 + modalImages.length) % modalImages.length
         updateCarousel()
      })

      closeButton.addEventListener("click", () => {
         modal.style.display = "none"
      })

      window.addEventListener("click", (event) => {
         if (event.target === modal) {
            modal.style.display = "none"
         }
      })
   }
   //Ouvre la modale en fonction du projet
   function openModal(project) {
      document.getElementById("modal-title").innerText = project.title
      modalImages = project.modal_images
      currentImageIndex = 0
      updateCarousel()

      document.getElementById("modal-info").innerText = project.project_info
      document.getElementById("modal-technologies").innerText = project.technologies.join(", ")
      document.getElementById("modal-year").innerText = project.year
      document.getElementById("modal-type").innerText = project.type
      document.getElementById("modal-github-link").href = project.github_link
      modal.style.display = "block"

      if (modalImages.length > 1) {
         document.getElementById("prev-image").style.display = "block"
         document.getElementById("next-image").style.display = "block"
      } else {
         document.getElementById("prev-image").style.display = "none"
         document.getElementById("next-image").style.display = "none"
      }
   }
   //Mise à jour de l'image du caroussel
   function updateCarousel() {
      const modalImagesContainer = document.getElementById("modal-images")
      modalImagesContainer.innerHTML = `<img src="${modalImages[currentImageIndex]}" alt="Project Image">`
   }

   initialize()
})
