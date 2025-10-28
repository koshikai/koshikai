import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Portfolio</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">About</a>
              <a href="#skills" className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Skills</a>
              <a href="#projects" className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Projects</a>
              <a href="#contact" className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Image
              className="mx-auto h-32 w-32 rounded-full"
              src="/avatar.jpg" // Replace with your avatar image
              alt="Profile picture"
              width={128}
              height={128}
            />
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Hello, I'm [Your Name]</h2>
            <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">Full Stack Developer</p>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-300">
              Passionate about creating beautiful and functional web applications. I love coding, learning new technologies, and solving complex problems.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">About Me</h3>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-500 dark:text-gray-300">
              I'm a software developer with experience in various technologies. I enjoy working on challenging projects and collaborating with teams to deliver high-quality solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Skills</h3>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl">⚛️</div>
                <p className="mt-2 text-lg font-medium text-gray-900 dark:text-white">React</p>
              </div>
              <div className="text-center">
                <div className="text-4xl">🟦</div>
                <p className="mt-2 text-lg font-medium text-gray-900 dark:text-white">TypeScript</p>
              </div>
              <div className="text-center">
                <div className="text-4xl">🌐</div>
                <p className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Next.js</p>
              </div>
              <div className="text-center">
                <div className="text-4xl">🎨</div>
                <p className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Tailwind CSS</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h3>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Project 1</h4>
                <p className="mt-2 text-gray-500 dark:text-gray-300">Description of project 1.</p>
                <a href="#" className="mt-4 inline-block text-blue-600 hover:text-blue-800">View Project</a>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Project 2</h4>
                <p className="mt-2 text-gray-500 dark:text-gray-300">Description of project 2.</p>
                <a href="#" className="mt-4 inline-block text-blue-600 hover:text-blue-800">View Project</a>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Project 3</h4>
                <p className="mt-2 text-gray-500 dark:text-gray-300">Description of project 3.</p>
                <a href="#" className="mt-4 inline-block text-blue-600 hover:text-blue-800">View Project</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Me</h3>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-300">Get in touch</p>
            <div className="mt-8">
              <a href="mailto:your.email@example.com" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Email Me</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 [Your Name]. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
