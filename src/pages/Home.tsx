import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedGrid } from '../components/AnimatedGrid';
import { SEO } from '../components/SEO';
import { CATEGORIES } from '../constants';
import { useDistros } from '../hooks/useDistros';
import { useTranslations } from '../hooks/useTranslations';
import { useLanguage } from '../contexts/LanguageContext';

const defaultTranslations = {
  pt: {
    heroTitle: "Portal de distros Linux",
    heroSubtitle: "Encontre e baixe a sua",
    searchPlaceholder: "Pesquise por distros Linux...",
    searchButton: "Buscar",
    beginnerText: "É iniciante no Linux?",
    beginnerLink: "DistroMatch",
    beginnerSubtext: "Uma ferramenta que te ajuda na escolha da melhor distro.",
    postDownloadTitle: "O que fazer depois de baixar sua distro?",
    viewArticle: "Saiba mais",
    distroListTitle: "Encontre e baixe a sua distro Linux",
    backToTop: "Voltar ao topo",
    allDistros: "Todas as distros",
    learnMore: "Conhecer e Baixar",
    categories: {
      "Todas as distros": "Todas as distros",
      "Pc antigo": "PC antigo",
      "Brasileira": "Brasileira",
      "Hacking": "Hacking",
      "Jogos": "Jogos",
      "Educação": "Educacional",
      "Raspberry": "Raspberry Pi",
      "Design": "Design",
      "Servidor": "Servidor",
      "Cinnamon": "Cinnamon",
      "Gnome": "Gnome",
      "KDE": "KDE",
      "LXDE": "LXDE",
      "LXQt": "LXQt",
      "Mate": "Mate",
      "Pantheon": "Pantheon",
      "Plasma": "Plasma",
      "Unity": "Unity",
      "XFCE": "XFCE",
      "Multimidia": "Multimídia"
    }
  },
  en: {
    heroTitle: "Linux Distro Portal",
    heroSubtitle: "Find and download yours",
    searchPlaceholder: "Search for Linux distros...",
    searchButton: "Search",
    beginnerText: "New to Linux?",
    beginnerLink: "DistroMatch",
    beginnerSubtext: "A tool that helps you choose the best distro.",
    postDownloadTitle: "What to do after downloading your distro?",
    viewArticle: "Learn more",
    distroListTitle: "Find and download your Linux distro",
    backToTop: "Back to top",
    allDistros: "All distros",
    learnMore: "Learn and Download",
    categories: {
      "Todas as distros": "All distros",
      "Pc antigo": "Old PC",
      "Brasileira": "Brazilian",
      "Hacking": "Hacking",
      "Jogos": "Gaming",
      "Educação": "Education",
      "Raspberry": "Raspberry Pi",
      "Design": "Design",
      "Servidor": "Server",
      "Cinnamon": "Cinnamon",
      "Gnome": "Gnome",
      "KDE": "KDE",
      "LXDE": "LXDE",
      "LXQt": "LXQt",
      "Mate": "Mate",
      "Pantheon": "Pantheon",
      "Plasma": "Plasma",
      "Unity": "Unity",
      "XFCE": "XFCE",
      "Multimidia": "Multimedia"
    }
  },
  es: {
    heroTitle: "Portal de distros Linux",
    heroSubtitle: "Encuentra y descarga la tuya",
    searchPlaceholder: "Busca distros Linux...",
    searchButton: "Buscar",
    beginnerText: "¿Eres nuevo en Linux?",
    beginnerLink: "DistroMatch",
    beginnerSubtext: "Una herramienta que te ayuda a elegir la mejor distro.",
    postDownloadTitle: "¿Qué hacer después de descargar tu distro?",
    viewArticle: "Saber más",
    distroListTitle: "Encuentra y descarga tu distro Linux",
    backToTop: "Volver arriba",
    allDistros: "Todas las distros",
    learnMore: "Conocer y Descargar",
    categories: {
      "Todas as distros": "Todas las distros",
      "Pc antigo": "PC antiguo",
      "Brasileira": "Brasileña",
      "Hacking": "Hacking",
      "Jogos": "Juegos",
      "Educação": "Educación",
      "Raspberry": "Raspberry Pi",
      "Design": "Diseño",
      "Servidor": "Servidor",
      "Cinnamon": "Cinnamon",
      "Gnome": "Gnome",
      "KDE": "KDE",
      "LXDE": "LXDE",
      "LXQt": "LXQt",
      "Mate": "Mate",
      "Pantheon": "Pantheon",
      "Plasma": "Plasma",
      "Unity": "Unity",
      "XFCE": "XFCE",
      "Multimidia": "Multimedia"
    }
  }
};

// Simple mapping for distro subtitles and descriptions that need translation
// In a real app, these would be in a CMS or a more robust translation file
const distroTranslations = {
  en: {
    'ubuntu-linux': { subtitle: 'A powerful distro for beginners and intermediate users.', description: 'Ubuntu is one of the most popular and widely used Linux distributions. Developed by Canonical, Ubuntu aims to provide an intuitive, friendly, and accessible desktop experience for users of all skill levels.' },
    'kali-linux': { subtitle: 'Kali Linux is an essential distro for security and penetration testing.', description: 'Kali Linux is a Linux distribution specialized in security and penetration testing. Designed for cybersecurity professionals and enthusiasts, Kali Linux offers a wide range of tools and features for security analysis, vulnerability exploration, and network auditing.' },
    'arch-linux': { subtitle: 'Arch Linux is a customizable distro aimed at advanced users.', description: 'Arch Linux is a lightweight and flexible Linux distribution, focused on simplicity, minimalism, and "Do It Yourself" (DIY) architecture. Designed for advanced users who want total control over their Linux experience, Arch Linux allows you to customize and build a tailored system, meeting individual needs.' },
    'opensuse': { subtitle: 'Stability and powerful tools for professionals.', description: 'openSUSE is a robust distribution, famous for the YaST configuration tool.' },
    'linux-mint': { subtitle: 'Linux Mint is a friendly and complete distro, perfect for home users.', description: 'Linux Mint is a Linux distribution based on Ubuntu, designed to be friendly, intuitive, and ready to use. With a focus on providing a pleasant desktop experience for users, Linux Mint is known for its familiar and stable interface, along with a careful selection of pre-installed software.' },
    'fedora-linux': { subtitle: 'Fedora is an innovative and stable distro for users and developers.', description: 'Fedora is a general-purpose Linux distribution known for its innovation, focus on technology, and commitment to free software. Developed by the community in collaboration with Red Hat, Fedora is used in both desktop and server environments, offering an up-to-date, secure, and stable user experience.' },
    'debian-linux': { subtitle: 'Debian is a solid and reliable base for various Linux distributions.', description: 'Debian is one of the oldest and most respected Linux distributions. Focused on stability, security, and free software, Debian is known for its community approach and commitment to free software principles. It is used in both desktop and server environments, offering a reliable and flexible operating system.' },
    'manjaro': { subtitle: 'Manjaro is a user-friendly distro with an elegant desktop experience.', description: 'Manjaro is a Linux distribution based on Arch Linux, which aims to provide a friendly, intuitive, and ready-to-use experience. It is known for its ease of installation, configuration, and software management. Manjaro is designed to meet the needs of beginners and advanced users, offering an elegant and stable desktop environment.' },
    'deepin': { subtitle: 'With a beautiful interface design, it is sophisticated and has many intuitive features.', description: 'Deepin is a Linux distro based on Debian, known for its modern, elegant, and intuitive user interface. It aims to provide an attractive and user-friendly desktop experience for users of all skill levels. Deepin is developed by the development team at Deepin Technology Co., Ltd., a Chinese technology company.' },
    'xubuntu': { subtitle: 'A very light, stable and elegant distro, ideal for older computers.', description: 'Xubuntu is a Linux distribution based on Ubuntu that offers a lightweight and efficient desktop experience. It combines the Xfce desktop environment with the features and stability of Ubuntu, providing a fast and customizable operating system.' },
    'elementary-os': { subtitle: 'Elementary OS is a very elegant and intuitive distro, focused on simplicity.', description: 'Elementary OS is a Linux distribution based on Ubuntu that stands out for its elegant and friendly user interface, inspired by the design of macOS. Designed to offer a simple and intuitive experience, Elementary OS is aimed at users who value a modern, consistent look and a minimalist approach.' },
    'zorin-os': { subtitle: 'Zorin OS is a friendly and attractive distro, designed for easy transition.', description: 'Zorin OS is a Linux distro based on Ubuntu, designed to be friendly for beginning users and provide a desktop experience similar to other popular operating systems like Windows and macOS. Zorin OS is known for its modern and elegant look, as well as intuitive features and tools.' },
    'mx-linux': { subtitle: 'It is a light and stable distro, with excellent community support.', description: 'MX Linux is a Linux distribution based on Debian that stands out for its stability, ease of use and efficiency. It is designed to be a versatile option, suitable for a wide range of users, from beginners to advanced users. MX Linux combines the Xfce desktop environment with custom tools to offer a complete and friendly experience.' },
    'slackware': { subtitle: 'Slackware is a traditional and robust distro, valued for its stability.', description: 'Slackware is one of the oldest and best-known Linux distributions. It is known for its simplicity, stability and focus on providing a "do-it-yourself" user experience. Slackware is a highly configurable distribution, allowing users to customize and tune the system to their specific needs.' },
    'bodhi': { subtitle: 'It is a light, minimalist and elegant distro, focused on efficiency and customization.', description: 'Bodhi Linux is a Linux distribution based on Ubuntu that stands out for its lightweight and highly customizable desktop environment. It uses the Enlightenment window manager, which offers a unique and efficient experience for users. Bodhi Linux is designed to be fast, stable and suitable for users who want a lightweight and highly configurable operating system.' },
    'big-linux': { subtitle: 'One of the best Brazilian distros, focused on ease of use.', description: 'Big Linux stands out for its intuitive and friendly interface, designed to be easy to use, even for beginners. It is a Brazilian project that focuses on offering a complete and easy-to-use system, with a focus on localization for Brazilian users, offering full support for the Portuguese language and specific resources for the culture and needs of Brazil.' },
    'lubuntu': { subtitle: 'Lubuntu is a light and efficient distro, ideal for computers with limited resources.', description: 'Lubuntu is a light and fast Linux distribution, designed to offer an efficient desktop environment for computers with limited resources.' },
    'linux-lite': { subtitle: 'A very light and stable distro, ideal for older computers.', description: 'Linux Lite is a lightweight and easy-to-use Linux distribution, designed to offer a friendly experience for beginners and also for those who have older hardware.' },
    'pop-os': { subtitle: 'Designed for fast navigation, easy workspace organization and flow.', description: 'Pop!_OS is a Linux distribution based on Ubuntu developed by System76, a hardware company focused on Linux computers.' },
    'sparkylinux': { subtitle: 'A fast, light and fully customizable distro that offers several versions', description: 'SparkyLinux is a Linux distribution based on Debian that aims to provide a lightweight, fast and easy-to-use operating system.' },
    'mageia': { subtitle: 'Mageia is a powerful and friendly distro, ideal for intermediate users.', description: 'Mageia is an open source Linux distribution, created by the community and derived from Mandriva Linux.' },
    'tails': { subtitle: 'Tails is a portable distro that protects you from surveillance and censorship.', description: 'Tails (The Amnesic Incognito Live System) is a Linux distribution focused on privacy and anonymity.' },
    'parrot-os': { subtitle: 'It is a complete security distro, aimed at pentesting and forensic analysis.', description: 'Parrot OS is a Linux distribution focused on security, privacy and penetration testing.' },
    'solus': { subtitle: 'Easy to use distro, designed for home computers with excellent performance.', description: 'Solus OS is an independent Linux distro that stands out for its focus on design, simplicity and ease of use.' },
    'edubuntu': { subtitle: 'Linux for education.', description: 'Edubuntu is the version of Ubuntu focused on schools and educational institutions.' },
    'kubuntu': { subtitle: 'Ubuntu with the power of KDE Plasma.', description: 'Kubuntu combines the Ubuntu base with the KDE Plasma desktop, highly customizable.' },
    'ubuntu-studio': { subtitle: 'A workstation for multimedia creators.', description: 'Ubuntu Studio comes pre-configured for audio, video and image editing.' },
    'ubuntu-cinnamon': { subtitle: 'Ubuntu with the Cinnamon desktop.', description: 'Ubuntu Cinnamon offers the Cinnamon desktop experience over the Ubuntu base.' },
    'ubuntu-kylin': { subtitle: 'The Chinese edition of Ubuntu.', description: 'Ubuntu Kylin is adapted for the Chinese market with the UKUI desktop.' },
    'ubuntu-mate': { subtitle: 'Classic retrospective with modern technologies.', description: 'Ubuntu MATE uses the MATE desktop, a continuation of the classic GNOME 2.' },
    'ubuntu-unity': { subtitle: 'The return of the Unity interface.', description: 'Ubuntu Unity brings back the Unity environment that was standard in Ubuntu for years.' },
    'regata-os': { subtitle: 'Focused on games and productivity, made in Brazil.', description: 'Regata OS is a Brazilian distro optimized for gamers and creators.' },
    'tiger-os': { subtitle: 'Focus on productivity and companies.', description: 'Tiger OS is a Brazilian distro focused on the corporate market and productivity.' },
    'mauna': { subtitle: 'Simplicity and beauty.', description: 'Mauna Linux is a Brazilian project that seeks to offer a polished and easy system.' },
    'steam-os': { subtitle: 'The Steam Deck system, focused on games.', description: 'SteamOS is designed to offer the best possible gaming experience.' },
    'endless-os': { subtitle: 'Knowledge for all, even without internet.', description: 'Endless OS comes with hundreds of pre-installed apps for offline use.' },
    'br-os': { subtitle: 'The Brazilian system for everyday life.', description: 'Br OS focuses on being a complete and familiar system for Brazilians.' },
    'chrome-os-flex': { subtitle: 'Turn your old PC into a Chromebook.', description: 'Chrome OS Flex is Google\'s version for old PCs and Macs.' },
    'fyde-os': { subtitle: 'ChromeOS with support for Android apps.', description: 'FydeOS is a fork of Chromium OS that adds support for Android and Linux apps.' },
    'red-hat': { subtitle: 'The corporate standard for servers and cloud.', description: 'RHEL is the leading commercial distribution for companies.' },
    'gentoo': { subtitle: 'Total customization through compilation.', description: 'Gentoo is a distro where the user compiles almost everything for their specific hardware.' },
    'antix': { subtitle: 'Extreme lightness without systemd.', description: 'AntiX is designed to be fast and light on very old computers.' },
    'alpine': { subtitle: 'Security, simplicity and efficiency in containers.', description: 'Alpine is a distro focused on security and small size, widely used in Docker.' },
    'void': { subtitle: 'An independent and stable distro.', description: 'Void Linux uses the runit init system and focuses on stability and simplicity.' },
    'raspberry-pi-os': { subtitle: 'The official system for the Raspberry Pi.', description: 'Raspberry Pi OS is optimized for Raspberry Pi hardware.' },
    'black-arch': { subtitle: 'Hacking and security based on Arch.', description: 'BlackArch contains thousands of tools for security testing.' },
    'backbox': { subtitle: 'Penetration testing and security assessment.', description: 'BackBox is a Ubuntu-based distro focused on forensics and security.' },
    'tuxedo-os': { subtitle: 'Optimized for TUXEDO hardware and more.', description: 'Tuxedo OS is a polished Ubuntu-based distro with KDE Plasma.' }
  },
  es: {
    'ubuntu-linux': { subtitle: 'Una poderosa distro para usuarios principiantes e intermedios.', description: 'Ubuntu es una de las distribuciones Linux más populares y ampliamente utilizadas. Desarrollado por la empresa Canonical, Ubuntu tiene como objetivo ofrecer una experiencia de escritorio intuitiva, amigável y accesible para usuarios de todos los niveles de habilidad.' },
    'kali-linux': { subtitle: 'Kali Linux es uma distro esencial para pruebas de seguridad y penetración.', description: 'Kali Linux es una distribución de Linux especializada en seguridad y pruebas de penetración. Diseñado para profesionales y entusiastas de la ciberseguridad, Kali Linux ofrece una amplia gama de herramientas y funciones para el análisis de seguridad, la exploración de vulnerabilidades y la auditoría de redes.' },
    'arch-linux': { subtitle: 'Arch Linux es una distro personalizable y dirigida a usuarios avanzados.', description: 'Arch Linux es una distribución de Linux ligera y flexible, centrada en la simplicidad, el minimalismo y la arquitectura "Hazlo tú mismo" (DIY). Diseñado para usuarios avanzados que desean un control total sobre su experiencia con Linux, Arch Linux le permite personalizar y construir un sistema a medida, satisfaciendo las necesidades individuales.' },
    'opensuse': { subtitle: 'Estabilidad y herramientas poderosas para profesionales.', description: 'openSUSE es una distribución robusta, famosa por la herramienta de configuración YaST.' },
    'linux-mint': { subtitle: 'Linux Mint es una distro amigable y completa, perfecta para usuarios domésticos.', description: 'Linux Mint es una distribución de Linux basada en Ubuntu, diseñada para ser amigable, intuitiva y lista para usar. Con un enfoque en proporcionar una experiencia de escritorio agradable para los usuarios, Linux Mint es conocido por su interfaz familiar y estable, junto con una selección cuidadosa de software preinstalado.' },
    'fedora-linux': { subtitle: 'Fedora es una distro innovadora y estable para usuarios y desarrolladores.', description: 'Fedora es una distribución Linux de propósito general conocida por su innovación, enfoque en la tecnología y compromiso con el software libre. Desarrollado por la comunidad en colaboración con Red Hat, Fedora se utiliza tanto en entornos de escritorio como de servidor, ofreciendo una experiencia de usuario actualizada, segura y estable.' },
    'debian-linux': { subtitle: 'Debian es una base sólida y confiable para diversas distribuciones de Linux.', description: 'Debian es una de las distribuciones de Linux más antiguas y respetadas. Centrado en la estabilidad, la seguridad y el software libre, Debian es conocido por su enfoque comunitario y su compromiso con los principios del software libre. Se utiliza tanto en entornos de escritorio como de servidor, ofreciendo un sistema operativo confiable y flexible.' },
    'manjaro': { subtitle: 'Manjaro es una distro fácil de usar con una elegante experiencia de escritorio.', description: 'Manjaro es una distribución de Linux basada en Arch Linux, que tiene como objetivo proporcionar una experiencia amigable, intuitiva y lista para usar. Es conocido por su facilidad de instalación, configuración y gestión de software. Manjaro está diseñado para satisfacer las necesidades de principiantes y usuarios avanzados, ofreciendo un entorno de escritorio elegante y estable.' },
    'deepin': { subtitle: 'Con un hermoso diseño de interfaz, es sofisticado y tiene muchas funciones intuitivas.', description: 'Deepin es una distribución de Linux basada en Debian, conocida por su interfaz de usuario moderna, elegante e intuitiva. Su objetivo es proporcionar una experiencia de escritorio atractiva y fácil de usar para usuarios de todos los niveles. Deepin es desarrollado por el equipo de desarrollo de Deepin Technology Co., Ltd., una empresa de tecnología china.' },
    'xubuntu': { subtitle: 'Una distro muy ligera, estable y elegante, ideal para ordenadores más antiguos.', description: 'Xubuntu es una distribución de Linux basada en Ubuntu que ofrece una experiencia de escritorio ligera y eficiente. Combina el entorno de escritorio Xfce con las características y la estabilidad de Ubuntu, proporcionando un sistema operativo rápido y personalizable.' },
    'elementary-os': { subtitle: 'Elementary OS es una distro muy elegante e intuitiva, enfocada en la simplicidad.', description: 'Elementary OS es una distribución de Linux basada en Ubuntu que destaca por su interfaz de usuario elegante y amigable, inspirada en el diseño de macOS. Diseñado para ofrecer una experiencia sencilla e intuitiva, Elementary OS está dirigido a usuarios que valoran un aspecto moderno y consistente y un enfoque minimalista.' },
    'zorin-os': { subtitle: 'Zorin OS es una distro amigable y atractiva, diseñada para una transición fácil.', description: 'Zorin OS es una distro de Linux basada en Ubuntu, diseñada para ser amigable para usuarios principiantes y brindar una experiencia de escritorio similar a la de otros sistemas operativos populares, como Windows y macOS. Zorin OS es conocido por su aspecto moderno y elegante, además de funciones y herramientas intuitivas.' },
    'mx-linux': { subtitle: 'Es una distro ligera y estable, con un excelente soporte de su comunidad.', description: 'MX Linux es una distribución de Linux basada en Debian que destaca por su estabilidad, facilidad de uso y eficiencia. Está diseñado para ser una opción versátil, adecuada para una amplia gama de usuarios, desde principiantes hasta usuarios avanzados. MX Linux combina el entorno de escritorio Xfce con herramientas personalizadas para ofrecer una experiencia completa y amigable.' },
    'slackware': { subtitle: 'Slackware es una distro tradicional y robusta, valorada por su estabilidad.', description: 'Slackware es una de las distribuciones de Linux más antiguas y conocidas. Es conocido por su simplicidad, estabilidad y enfoque en brindar una experiencia de usuario "hazlo tú mismo". Slackware es una distribución altamente configurable, que permite a los usuarios personalizar y ajustar el sistema según sus necesidades específicas.' },
    'bodhi': { subtitle: 'Es una distro ligera, minimalista y elegante, enfocada en la eficiencia y la personalización.', description: 'Bodhi Linux es una distribución de Linux basada en Ubuntu que destaca por su entorno de escritorio ligero y altamente personalizable. Utiliza el gestor de ventanas Enlightenment, que ofrece una experiencia única y eficiente para los usuarios. Bodhi Linux está diseñado para ser rápido, estável y adecuado para usuarios que desean un sistema operativo ligero y altamente configurable.' },
    'big-linux': { subtitle: 'Una de las mejores distros brasileñas, enfocada en la facilidad de uso.', description: 'Big Linux destaca por su interfaz intuitiva y amigable, diseñada para ser fácil de usar, incluso para principiantes. Es un proyecto brasileño que se centra en ofrecer un sistema completo y fácil de usar, con un enfoque en la localización para los usuarios brasileños, ofreciendo soporte completo para el idioma portugués y recursos específicos para la cultura y las necesidades de Brasil.' },
    'lubuntu': { subtitle: 'Lubuntu es una distro ligera y eficiente, ideal para ordenadores con recursos limitados.', description: 'Lubuntu es una distribución Linux ligera y rápida, diseñada para ofrecer un entorno de escritorio eficiente para ordenadores con recursos limitados.' },
    'linux-lite': { subtitle: 'Una distro muy ligera y estable, ideal para ordenadores más antiguos.', description: 'Linux Lite es una distribución Linux ligera y fácil de usar, diseñada para ofrecer una experiencia amigable para usuarios principiantes y también para aquellos que poseen hardware más antiguo.' },
    'pop-os': { subtitle: 'Diseñado para una navegación rápida, fácil organización del espacio de trabajo y flujo.', description: 'Pop!_OS es una distribución Linux basada en Ubuntu desarrollada por System76, una empresa de hardware centrada en ordenadores Linux.' },
    'sparkylinux': { subtitle: 'Una distro rápida, ligera y totalmente personalizable que ofrece diversas versiones', description: 'SparkyLinux es una distribución Linux basada en Debian que tiene como objetivo proporcionar un sistema operativo ligero, rápido y fácil de usar.' },
    'mageia': { subtitle: 'Mageia es una distro potente y amigable, ideal para usuarios intermedios.', description: 'Mageia es una distribución Linux de código abierto, creada por la comunidad y derivada de Mandriva Linux.' },
    'tails': { subtitle: 'Tails es una distro portátil que te protege de la vigilancia y la censura.', description: 'Tails (The Amnesic Incognito Live System) es una distribución Linux centrada en la privacidad y el anonimato.' },
    'parrot-os': { subtitle: 'Es una distro de seguridad completa, orientada al pentesting y al análisis forense.', description: 'Parrot OS es una distribución Linux centrada en la seguridad, la privacidad y las pruebas de penetración.' },
    'solus': { subtitle: 'Distro fácil de usar, diseñada para ordenadores domésticos con un excelente rendimiento.', description: 'Solus OS es una distro Linux independiente que destaca por su enfoque en el diseño, la simplicidad y la facilidad de uso.' },
    'edubuntu': { subtitle: 'Linux para la educación.', description: 'Edubuntu es la versión de Ubuntu centrada en escuelas e instituciones educativas.' },
    'kubuntu': { subtitle: 'Ubuntu con el poder de KDE Plasma.', description: 'Kubuntu combina la base de Ubuntu con el escritorio KDE Plasma, altamente personalizable.' },
    'ubuntu-studio': { subtitle: 'Una estación de trabajo para creadores multimedia.', description: 'Ubuntu Studio viene preconfigurado para la edición de audio, vídeo e imagen.' },
    'ubuntu-cinnamon': { subtitle: 'Ubuntu con el escritorio Cinnamon.', description: 'Ubuntu Cinnamon ofrece la experiencia del escritorio Cinnamon sobre la base de Ubuntu.' },
    'ubuntu-kylin': { subtitle: 'La edición china de Ubuntu.', description: 'Ubuntu Kylin está adaptado para el mercado chino con el escritorio UKUI.' },
    'ubuntu-mate': { subtitle: 'Retrospectiva clásica con tecnologías modernas.', description: 'Ubuntu MATE utiliza el escritorio MATE, continuación do clásico GNOME 2.' },
    'ubuntu-unity': { subtitle: 'El regreso de la interfaz Unity.', description: 'Ubuntu Unity trae de vuelta el entorno Unity que fue estándar en Ubuntu durante años.' },
    'regata-os': { subtitle: 'Enfocado en juegos y productividad, hecho en Brasil.', description: 'Regata OS es una distro brasileña optimizada para gamers y creadores.' },
    'tiger-os': { subtitle: 'Enfoque en productividad y empresas.', description: 'Tiger OS es una distro brasileña centrada en el mercado corporativo y la productividad.' },
    'mauna': { subtitle: 'Simplicidad y belleza.', description: 'Mauna Linux es un proyecto brasileño que busca ofrecer un sistema pulido y fácil.' },
    'steam-os': { subtitle: 'El sistema de la Steam Deck, enfocado en juegos.', description: 'SteamOS está diseñado para ofrecer la mejor experiencia de juego posible.' },
    'endless-os': { subtitle: 'Conocimiento para todos, incluso sin internet.', description: 'Endless OS viene con cientos de aplicaciones preinstaladas para uso offline.' },
    'br-os': { subtitle: 'El sistema brasileño para el día a día.', description: 'Br OS se centra en ser un sistema completo y familiar para los brasileños.' },
    'chrome-os-flex': { subtitle: 'Convierte tu PC antiguo en un Chromebook.', description: 'Chrome OS Flex es la versión de Google para PCs y Macs antiguos.' },
    'fyde-os': { subtitle: 'ChromeOS con soporte para apps Android.', description: 'FydeOS es un fork de Chromium OS que añade soporte para apps Android y Linux.' },
    'red-hat': { subtitle: 'El estándar corporativo para servidores y la nube.', description: 'RHEL es la distribución comercial líder para empresas.' },
    'gentoo': { subtitle: 'Personalización total a través de la compilación.', description: 'Gentoo es una distro donde el usuario compila casi todo para su hardware específico.' },
    'antix': { subtitle: 'Ligereza extrema sin systemd.', description: 'AntiX está diseñado para ser rápido y ligero en ordenadores muy antiguos.' },
    'alpine': { subtitle: 'Seguridad, simplicidad y eficiencia en contenedores.', description: 'Alpine es una distro centrada en la seguridad y el tamaño reducido, muy utilizada en Docker.' },
    'void': { subtitle: 'Una distro independiente y estable.', description: 'Void Linux utiliza el sistema de init runit y se centra en la estabilidad y la simplicidad.' },
    'raspberry-pi-os': { subtitle: 'El sistema oficial para la Raspberry Pi.', description: 'Raspberry Pi OS está optimizado para el hardware de Raspberry Pi.' },
    'black-arch': { subtitle: 'Hacking y seguridad basada en Arch.', description: 'BlackArch contiene miles de herramientas para pruebas de seguridad.' },
    'backbox': { subtitle: 'Pruebas de penetración y evaluación de seguridad.', description: 'BackBox es una distro basada en Ubuntu centrada en el análisis forense y la seguridad.' },
    'tuxedo-os': { subtitle: 'Optimizado para hardware TUXEDO y más.', description: 'Tuxedo OS es una distro pulida basada en Ubuntu con KDE Plasma.' }
  }
};

export const Home = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const { lang } = useLanguage();
  const translations = useTranslations('home', defaultTranslations);
  const t = translations[lang];
  const DISTROS = useDistros();
  
  const [selectedCategory, setSelectedCategory] = useState("Todas as distros");
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedCategory("Todas as distros");
  }, [lang]);

  useEffect(() => {
    const s = searchParams.get('search');
    if (s) setSearch(s);
  }, [searchParams]);

  const filteredDistros = DISTROS.filter(distro => {
    const matchesSearch = distro.name.toLowerCase().includes(search.toLowerCase()) || 
                         distro.subtitle.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "Todas as distros" || distro.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const getTranslatedDistro = (distro: typeof DISTROS[0]) => {
    if (lang === 'pt') return distro;
    const trans = distroTranslations[lang as 'en' | 'es']?.[distro.id];
    if (!trans) return distro;
    return {
      ...distro,
      subtitle: trans.subtitle,
      description: trans.description
    };
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-20">
      <SEO 
        title="Meu Linux | Encontre, Baixe e Aprenda Tudo Sobre Distros Linux"
        description="Descubra o mundo Linux com o Meu Linux. Encontre as melhores distribuições, guias de instalação, tutoriais de pós-instalação e muito mais para iniciantes e avançados."
        canonical="https://meulinux.com.br/"
      />
      {/* Hero Section */}
      <section className="relative bg-dark text-white py-24 overflow-hidden">
        <AnimatedGrid />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Column: Content */}
            <div className="text-left">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl md:text-4xl font-display font-bold mb-1 text-primary"
              >
                {t.heroTitle}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-2xl text-white mb-8"
              >
                {t.heroSubtitle}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative mb-12 max-w-lg"
              >
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-white text-dark rounded-[6px] py-4 px-8 pl-14 pr-32 text-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 search-input"
                    value={search}
                    onChange={handleSearchChange}
                  />
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 search-icon" />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-[6px] font-bold hover:bg-primary/90 transition-all"
                  >
                    {t.searchButton}
                  </button>
                </form>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl max-w-lg"
              >
                <p className="text-white/80">
                  <strong>{t.beginnerText}</strong> Use o <Link to="/distromatch" className="text-primary font-bold hover:underline" aria-label="Ferramenta Distro Match"><span className="font-normal">Distro</span>Match</Link>
                  <br />
                  {t.beginnerSubtext}
                </p>
              </motion.div>
            </div>

            {/* Right Column: Banner */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:block"
            >
              <a 
                href="https://iatutor.meulinux.com.br/" 
                target="_blank" 
                rel="noreferrer"
                className="block group relative"
              >
                <img 
                  src="https://meulinux.com.br/wp-content/uploads/2026/02/8888-1.png" 
                  alt="Aprenda Linux e DevOps"
                  className="relative rounded-[6px] shadow-2xl border-2 border-primary hover:scale-[1.02] transition-transform duration-500 w-full"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback if image fails
                    (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/linux/800/400';
                  }}
                />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Post-Download Section */}
      <section className="py-4 bg-primary text-white">
        <div className="container-custom flex items-center justify-center gap-6">
          <h2 className="text-lg md:text-xl font-bold">{t.postDownloadTitle}</h2>
          <Link 
            to="/pos-instalacao"
            className="border-2 border-white text-white px-6 py-2 rounded-[6px] hover:bg-white hover:text-primary transition-all text-sm md:text-base whitespace-nowrap font-normal"
          >
            {t.viewArticle}
          </Link>
        </div>
      </section>

      {/* Distro List Section */}
      <section ref={resultsRef} className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-4">{t.distroListTitle}</h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-[6px] text-sm font-medium transition-all home-filter-btn ${
                  selectedCategory === cat 
                    ? 'bg-primary text-white shadow-lg active' 
                    : 'bg-[#E2E2E2] text-dark hover:bg-gray-300'
                }`}
              >
                {t.categories[cat as keyof typeof t.categories] || cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDistros.map((distro, i) => {
              const translatedDistro = getTranslatedDistro(distro);
              return (
                <motion.div
                  key={distro.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white distro-card rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all group border border-gray-100"
                >
                  <div className="h-16 w-16 mb-4 flex items-center justify-center bg-gray-50 rounded-xl distro-card">
                    <img src={distro.logo} alt={distro.name} className="max-h-12 max-w-12 object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{distro.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2">{translatedDistro.subtitle}</p>
                  <Link 
                    to={`/${distro.id}`}
                    className="inline-flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all"
                  >
                    {t.learnMore} <ArrowRight size={18} />
                  </Link>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>
    </div>
  );
};
