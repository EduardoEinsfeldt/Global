import Image from 'next/image';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Sobre() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <Image
          src="/img/FotoEduardo.jpg"
          alt="Foto de Eduardo Augusto Pelegrino Einsfeldt"
          width={150}
          height={150}
          className="rounded-full mx-auto mb-6"
        />
        <h2 className="text-3xl font-bold text-green-800 mb-2">Eduardo Augusto Pelegrino Einsfeldt</h2>
        <p className="text-lg text-gray-700 mb-4">RM: 556460</p>
        <p className="text-lg text-gray-700 mb-4">Turma: 1TDSPM</p>
        <div className="flex justify-center space-x-6 mt-4">
          <a
            href="https://github.com/EduardoEinsfeldt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-green-600 transition duration-300"
          >
            <FaGithub size={32} />
          </a>
          <a
            href="https://www.linkedin.com/in/eduardo-augusto-pelegrino-einsfeldt-289722247/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-800 hover:text-green-600 transition duration-300"
          >
            <FaLinkedin size={32} />
          </a>
        </div>
      </div>
    </div>
  );
}
