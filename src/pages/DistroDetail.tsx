import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Download, Globe, Cpu, Box, HardDrive, Info, ArrowRight, Database, X, Volume2 } from 'lucide-react';
import { AudioReader } from '../components/AudioReader';
import { useDistros } from '../hooks/useDistros';
import { useLanguage } from '../contexts/LanguageContext';
import { AnimatedGrid } from '../components/AnimatedGrid';
import { SEO } from '../components/SEO';

const translations = {
  pt: {
    notFound: "Distro não encontrada",
    backHome: "Voltar para o início",
    about: "Sobre o",
    desktopEnvironments: "Ambientes de desktop disponíveis:",
    mainFeatures: "Principais recursos:",
    packageManager: "Gerenciador de pacotes:",
    preInstalledSoftware: "Software pré-instalado:",
    hardwareCompatibility: "Compatibilidade de hardware:",
    communitySupport: "Comunidade e suporte:",
    comparison: "Comparação com outras distribuições:",
    flavors: "Conheça também os sabores do",
    quickInfo: "Informações Rápidas",
    basedOn: "Baseado em",
    country: "País",
    architecture: "Arquitetura",
    isoFile: "Arquivo ISO",
    downloadOfficial: "Baixar no site oficial"
  },
  en: {
    notFound: "Distro not found",
    backHome: "Back to home",
    about: "About",
    desktopEnvironments: "Available desktop environments:",
    mainFeatures: "Main features:",
    packageManager: "Package manager:",
    preInstalledSoftware: "Pre-installed software:",
    hardwareCompatibility: "Hardware compatibility:",
    communitySupport: "Community and support:",
    comparison: "Comparison with other distributions:",
    flavors: "Also check out the flavors of",
    quickInfo: "Quick Info",
    basedOn: "Based on",
    country: "Country",
    architecture: "Architecture",
    isoFile: "ISO File",
    downloadOfficial: "Download on official site"
  },
  es: {
    notFound: "Distro no encontrada",
    backHome: "Volver al inicio",
    about: "Sobre",
    desktopEnvironments: "Entornos de escritorio disponibles:",
    mainFeatures: "Principales características:",
    packageManager: "Gestor de paquetes:",
    preInstalledSoftware: "Software preinstalado:",
    hardwareCompatibility: "Compatibilidad de hardware:",
    communitySupport: "Comunidad y soporte:",
    comparison: "Comparación con otras distribuciones:",
    flavors: "Conoce también los sabores de",
    quickInfo: "Información Rápida",
    basedOn: "Basado en",
    country: "País",
    architecture: "Arquitectura",
    isoFile: "Archivo ISO",
    downloadOfficial: "Descargar en el sitio oficial"
  }
};

// Reuse the same distro translations mapping
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
    'ubuntu-linux': { subtitle: 'Una poderosa distro para usuarios principiantes e intermedios.', description: 'Ubuntu es una de las distribuciones Linux más populares y ampliamente utilizadas. Desarrollado por la empresa Canonical, Ubuntu tiene como objetivo ofrecer una experiencia de escritorio intuitiva, amigable y accesible para usuarios de todos los niveles de habilidad.' },
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
    'mx-linux': { subtitle: 'Es una distro ligera y estable, con un excelente soporte de su comunidad.', description: 'MX Linux es una distribución de Linux basada en Debian que destaca por su estabilidad, facilidad de uso y eficiencia. Está diseñado para ser una opción versátil, adecuada para una amplia gama de usuarios, desde principiantes hasta usuarios avanzados. MX Linux conbina el entorno de escritorio Xfce con herramientas personalizadas para ofrecer una experiencia completa y amigable.' },
    'slackware': { subtitle: 'Slackware es una distro tradicional y robusta, valorada por su estabilidad.', description: 'Slackware es una de las distribuciones de Linux más antiguas y conocidas. Es conocido por su simplicidad, estabilidad y enfoque en brindar una experiencia de usuario "hazlo tú mismo". Slackware es una distribución altamente configurable, que permite a los usuarios personalizar y ajustar el sistema según sus necesidades específicas.' },
    'bodhi': { subtitle: 'Es una distro ligera, minimalista y elegante, enfocada en la eficiencia y la personalización.', description: 'Bodhi Linux es una distribución de Linux basada en Ubuntu que destaca por su entorno de escritorio ligero y altamente personalizable. Utiliza el gestor de ventanas Enlightenment, que ofrece una experiencia única y eficiente para los usuarios. Bodhi Linux está diseñado para ser rápido, estável y adecuado para usuarios que desean un sistema operativo ligero y altamente configurable.' },
    'big-linux': { subtitle: 'Una de las mejores distros brasileñas, enfocada en la facilidad de uso.', description: 'Big Linux destaca por su interfaz intuitiva y amigable, diseñada para ser fácil de usar, incluso para principiantes. Es un proyecto brasileño que se centra en ofrecer un sistema completo y fácil de usar, con un enfoque en la localización para los usuarios brasileños, ofreciendo soporte completo para el idioma portugués y recursos específicos para la cultura y las necesidades de Brasil.' },
    'lubuntu': { subtitle: 'Lubuntu es una distro ligera e eficiente, ideal para ordenadores con recursos limitados.', description: 'Lubuntu es una distribución Linux ligera y rápida, diseñada para ofrecer un entorno de escritorio eficiente para ordenadores con recursos limitados.' },
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

export const DistroDetail = () => {
  const { id } = useParams();
  const { lang } = useLanguage();
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const t = translations[lang];
  const DISTROS = useDistros();
  const distro = DISTROS.find(d => d.id === id);

  if (!distro) {
    return (
      <div className="min-h-screen pt-40 text-center">
        <h1 className="text-4xl font-bold mb-4">{t.notFound}</h1>
        <Link to="/" className="text-primary font-bold">{t.backHome}</Link>
      </div>
    );
  }

  const getTranslatedDistro = (d: typeof DISTROS[0]) => {
    if (lang === 'pt') return d;
    const trans = distroTranslations[lang as 'en' | 'es']?.[d.id];
    if (!trans) return d;
    return {
      ...d,
      subtitle: trans.subtitle,
      description: trans.description
    };
  };

  const translatedDistro = getTranslatedDistro(distro);

  // SEO Logic
  let seoTitle = `${distro.name} - Meu Linux`;
  let seoDescription = translatedDistro.description.substring(0, 160);

  if (lang === 'pt') {
    if (distro.id === 'ubuntu-linux') {
      seoTitle = "Ubuntu - Uma poderosa distro para usuários iniciantes e intermediários";
      seoDescription = "O Ubuntu é uma das distribuições Linux mais populares e amplamente utilizadas. Desenvolvido pela Canonical, oferece uma experiência intuitiva e amigável.";
    } else if (distro.id === 'kali-linux') {
      seoTitle = "Kali Linux: Guia Definitivo de Segurança e Pentest (2026)";
      seoDescription = "Kali Linux explicado em profundidade. História, filosofia, ferramentas, pentest, segurança, requisitos e uso profissional atualizados para 2026.";
    } else if (distro.id === 'arch-linux') {
      seoTitle = "Arch Linux: Guia Definitivo 2026 — Rolling Release, Pacman, AUR e Controle Total";
      seoDescription = "Arch Linux explicado em profundidade. Filosofia KISS, rolling release, pacman, AUR, requisitos, vantagens e desafios atualizados para 2026.";
    } else if (distro.id === 'debian-linux') {
      seoTitle = "Debian Linux: Guia Definitivo 2026 — Estabilidade, Servidores e Base do Ecossistema";
      seoDescription = "Debian Linux explicado em profundidade. História, filosofia, estabilidade, versões, servidores, requisitos e comparações atualizadas para 2026.";
    } else if (distro.id === 'fedora-linux') {
      seoTitle = "Fedora Linux: Guia Definitivo 2026 — Inovação, Desktop e Servidores";
      seoDescription = "Fedora Linux explicado em profundidade. Filosofia, inovação, desktop, servidores, Red Hat e requisitos atualizados para 2026.";
    } else if (distro.id === 'linux-mint') {
      seoTitle = "Linux Mint: Guia Definitivo 2026 — Simplicidade e Desktop Clássico";
      seoDescription = "Linux Mint explicado em profundidade. História, filosofia, desktop Cinnamon, requisitos e comparações atualizadas para 2026.";
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <SEO 
        title={seoTitle}
        description={seoDescription}
        canonical={`https://meulinux.com.br/distro/${distro.id}`}
        ogImage={distro.logo}
      />
      {/* Hero */}
      <section className="bg-dark text-white py-24 relative overflow-hidden">
        <AnimatedGrid />
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-32 w-32 bg-white distro-card rounded-3xl p-4 flex items-center justify-center shadow-2xl" aria-hidden="true">
              <img src={distro.logo} alt="" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl md:text-6xl font-display font-bold mb-4"
              >
                {distro.name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-2xl text-white/70"
              >
                {translatedDistro.subtitle}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Post-Download Section */}
      <section className="py-4 bg-primary text-white">
        <div className="container-custom flex items-center justify-center gap-6">
          <h2 className="text-lg md:text-xl font-bold">
            {lang === 'pt' ? 'O que fazer depois de baixar sua distro?' : 
             lang === 'en' ? 'What to do after downloading your distro?' : 
             '¿Qué hacer después de descargar tu distro?'}
          </h2>
          <Link 
            to="/pos-instalacao"
            className="border-2 border-white text-white px-6 py-2 rounded-[6px] hover:bg-white hover:text-primary transition-all text-sm md:text-base whitespace-nowrap font-normal"
          >
            {lang === 'pt' ? 'Saiba mais' : lang === 'en' ? 'Learn more' : 'Saber más'}
          </Link>
        </div>
      </section>

      <section className="py-20 bg-white" aria-labelledby="distro-info-heading">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <article className="bg-white distro-card p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                <h2 id="distro-info-heading" className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Info className="text-primary" aria-hidden="true" /> {t.about} {distro.name}
                </h2>

                <AudioReader 
                  title={distro.name} 
                  text={`${translatedDistro.description}. Ambientes de desktop: ${distro.desktopEnvironments}. Principais características: ${distro.mainFeatures}. Gerenciador de pacotes: ${distro.packageManager}.`} 
                />

                <p className="text-lg text-gray-700 leading-relaxed mb-8 text-left">{translatedDistro.description}</p>
                
                <h3 className="text-xl font-bold mb-4">{t.desktopEnvironments}</h3>
                <p className="text-gray-600 mb-8">{distro.desktopEnvironments}</p>

                <h3 className="text-xl font-bold mb-4">{t.mainFeatures}</h3>
                <p className="text-gray-600 mb-8">{distro.mainFeatures}</p>

                <h3 className="text-xl font-bold mb-4">{t.packageManager}</h3>
                <p className="text-gray-600 mb-8">{distro.packageManager}</p>

                <h3 className="text-xl font-bold mb-4">{t.preInstalledSoftware}</h3>
                <p className="text-gray-600 mb-8">{distro.preInstalledSoftware}</p>

                <h3 className="text-xl font-bold mb-4">{t.hardwareCompatibility}</h3>
                <div className="text-gray-600 mb-8">
                  {distro.hardwareCompatibility.includes('Requisitos mínimos:') ? (
                    <>
                      <p className="mb-6">{distro.hardwareCompatibility.split('Requisitos mínimos:')[0].trim()}</p>
                      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-inner">
                        <p className="font-bold mb-4 text-gray-900 flex items-center gap-2">
                          <Info size={18} className="text-primary" />
                          Requisitos mínimos:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          {distro.hardwareCompatibility.split('Requisitos mínimos:')[1].split(',').map((req, idx) => {
                            const cleanReq = req.trim().replace(/\.$/, '');
                            if (cleanReq.toLowerCase().includes('processador')) {
                              return (
                                <div key={idx} className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2 text-primary mb-1">
                                    <Cpu size={14} />
                                    <span className="text-[10px] uppercase font-bold tracking-wider">Processador</span>
                                  </div>
                                  <p className="text-sm font-bold text-gray-900">{cleanReq.replace(/processador/i, '').trim()}</p>
                                </div>
                              );
                            }
                            if (cleanReq.toLowerCase().includes('hd/ssd')) {
                              return (
                                <div key={idx} className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2 text-primary mb-1">
                                    <HardDrive size={14} />
                                    <span className="text-[10px] uppercase font-bold tracking-wider">HD/SSD</span>
                                  </div>
                                  <p className="text-sm font-bold text-gray-900">{cleanReq.replace(/hd\/ssd/i, '').trim()}</p>
                                </div>
                              );
                            }
                            if (cleanReq.toLowerCase().includes('memória')) {
                              return (
                                <div key={idx} className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2 text-primary mb-1">
                                    <Database size={14} />
                                    <span className="text-[10px] uppercase font-bold tracking-wider">Memória</span>
                                  </div>
                                  <p className="text-sm font-bold text-gray-900">{cleanReq.replace(/memória/i, '').trim()}</p>
                                </div>
                              );
                            }
                            return (
                              <div key={idx} className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-primary mb-1">
                                  <Info size={14} />
                                  <span className="text-[10px] uppercase font-bold tracking-wider">Info</span>
                                </div>
                                <p className="text-sm font-bold text-gray-900">{cleanReq}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p>{distro.hardwareCompatibility}</p>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-4">{t.communitySupport}</h3>
                <p className="text-gray-600 mb-8">{distro.communitySupport}</p>

                <h3 className="text-xl font-bold mb-4">{t.comparison}</h3>
                <p className="text-gray-600 mb-8">{distro.comparison}</p>
              </article>

              {/* Gallery Placeholder */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {distro.screenshots && distro.screenshots.length > 0 ? (
                  distro.screenshots.map((screenshot, index) => (
                    <div 
                      key={index} 
                      className="aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(screenshot)}
                    >
                      <img 
                        src={screenshot} 
                        alt={`${distro.name} Screenshot ${index + 1}`} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))
                ) : (
                  [1, 2].map(i => (
                    <div 
                      key={i} 
                      className="aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(`https://picsum.photos/seed/${distro.id}${i}/1200/800`)}
                    >
                      <img 
                        src={`https://picsum.photos/seed/${distro.id}${i}/800/450`} 
                        alt="Screenshot" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-white distro-card p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
                <h3 className="text-xl font-bold mb-6">{t.quickInfo}</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary"><Box size={20} /></div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">{t.basedOn}</p>
                      <p className="font-bold">{distro.basedOn}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary"><Globe size={20} /></div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">{t.country}</p>
                      <p className="font-bold">{distro.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary"><Cpu size={20} /></div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">{t.architecture}</p>
                      <p className="font-bold">{distro.architecture}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary"><HardDrive size={20} /></div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">{t.isoFile}</p>
                      <p className="font-bold">{distro.isoSize}</p>
                    </div>
                  </div>
                </div>

                <a 
                  href={distro.officialSite} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full mt-8 bg-primary text-white py-4 rounded-[6px] font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg"
                >
                  <Download size={20} /> {t.downloadOfficial}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-primary transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={40} />
          </button>
          <motion.img 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={selectedImage} 
            alt="Full size view" 
            className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
};
