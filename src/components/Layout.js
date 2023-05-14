/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */

export default function Main() {
  return (
    <div className="grotesk max-w-8xl mx-auto">
      <section className="w-full text-black">
        <div className="max-w-8xl mx-auto inline-block items-center p-6 pt-0 lg:flex lg:flex-wrap lg:pt-4">
          <div className="lg:w-3/6 p-6">
            <h2 className="max-w-xl lg:text-[1.8em] text-xl font-bold leading-none text-black inline-block">
              CONGRESO NACIONAL DE MARKETING POLÍTICO – COLOMBIA 2023
            </h2>

            <p className="mt-6 max-w-2xl text-xl font-semibold text-[#404040] text-justify">
              El Congreso Nacional de Marketing político, reúne a los principales estrategas y consultores de la comunicación y el marketing político en Colombia, con el fin de orientar a candidatos, asesores, investigadores y estudiantes universitarios, y partidos políticos interesados en conocer de las últimas tendencias en estrategia y comunicación política para ganar elecciones.
            </p>
            <p className="mt-6 max-w-2xl text-xl font-semibold text-[#404040] text-justify">
              Este evento se realizará el 14 y 15 de julio en la ciudad de Bucaramanga y en él se certificará a los asistentes su partición en el evento.            </p>
          </div>
          <div className="mb-20 mt-44 hidden w-full flex-col lg:mt-12 lg:inline-block lg:w-3/6">
            <img src="/images/placeholder.png" alt="Hero" />
          </div>
          <div className="my-20 inline-block w-full flex-col lg:mt-0 lg:hidden lg:w-2/5">
            <img src="/images/placeholder.png" alt="image" />aha
          </div>
        </div>
        <div className="mt-0 bg-white">
          <div className="mx-auto">
            <div className="mx-auto px-5 py-10 lg:px-24">
              <div className="my-10 flex w-full flex-col text-center">
                <h2 className="mb-5 text-2xl font-bold text-black lg:text-3xl">
                  ¿A quién va dirigido?
                </h2>
              </div>
              <div
                className="
                grid grid-cols-2
                gap-16
                text-center
                lg:grid-cols-3"
              >
                <div className="hidden items-center justify-center lg:inline-block">
                  <h2 className="mb-5 text-2xl font-bold text-[#404040] lg:text-3xl">
                    Estudiantes Universitarios
                  </h2>
                  {/* <img
                    src="/images/segment.png"
                    alt="Segment"
                    className="block h-24 object-contain"
                  /> */}
                </div>
                <div className="hidden items-center justify-center lg:inline-block">
                  <h2 className="mb-5 text-2xl font-bold text-[#404040] lg:text-3xl">
                    Investigadores Universitarios
                  </h2>
                </div>
                <div className="flex items-center justify-center">
                  <h2 className="mb-5 text-2xl font-bold text-[#404040] lg:text-3xl">
                    Candidatos a cargos de elección popular
                  </h2>
                </div>
                <div className="flex items-center justify-center">
                  <h2 className="mb-5 text-2xl font-bold text-[#404040] lg:text-3xl">
                    Profesionales de la comunicación política
                  </h2>
                </div>
                <div className="hidden items-center justify-center lg:inline-block">
                  <h2 className="mb-5 text-2xl font-bold text-[#404040] lg:text-3xl">
                    Asesores Políticos
                  </h2>
                </div>
                <div className="hidden items-center justify-center lg:inline-block">
                  <h2 className="mb-5 text-2xl font-bold text-[#404040] lg:text-3xl">
                    Partidos políticos
                  </h2>
                </div>
              </div>
              {/* <div className="my-12 flex w-full flex-col pl-8 text-center">
                <a
                  href="/"
                  className="
                  underline-blue
                  mb-8
                  mt-6
                  text-xl
                  font-bold
                  text-black
                "
                >
                  Ut eleifend.
                </a>
              </div> */}
            </div>
          </div>
          <div className="bg-white text-black">
            <div className="my-10 flex w-full flex-col text-center">
              <h2 className="mb-5 text-2xl font-bold text-black lg:text-3xl">
                CONFERENCISTAS PARTICIPANTES
              </h2>
            </div>
            <div className="mx-auto flex flex-col items-center px-5 pt-10 lg:flex-row">
              <div className="mb-16 flex flex-col text-left lg:mb-0 lg:w-1/2 lg:flex-grow lg:items-start lg:pr-16 lg:pr-6">
                <h2 className="mb-4 text-4xl font-bold leading-none sm:text-5xl">
                  Ángel Beccassino
                </h2>
                <p className="font-3xl mb-8 font-semibold leading-relaxed">
                  La construcción de una candidatura ganadora

                </p>
              </div>
              <div className="lg:w-full lg:max-w-2xl">
                <img src="/images/placeholder.png" alt="img" />
              </div>
            </div>
            <div className="mt-5">
              <div className="mx-auto flex flex-col px-5 py-24 text-left lg:flex-row">
                <div className="hidden lg:inline-block lg:w-full lg:max-w-xl">
                  <img src="/images/placeholder.png" alt="img" />
                </div>
                <div className="flex flex-col pt-0 text-left lg:w-1/2 lg:flex-grow lg:items-start lg:pl-16 lg:pl-24 lg:pt-24">
                  <h2 className="mb-4 text-4xl font-bold leading-none sm:text-5xl">
                    Jorge Salim eljach
                  </h2>
                  <p className="mb-8 font-semibold leading-relaxed text-black">
                    Cómo conformar la empresa política de campaña.
                  </p>
                </div>
                <div className="inline-block lg:hidden lg:w-full lg:max-w-xl">
                  <img src="/images/placeholder.png" alt="img" />
                </div>
              </div>
            </div><div className="mt-5">
              <div className="mx-auto flex flex-col px-5 py-24 text-left lg:flex-row">
                <div className="flex flex-col pt-0 text-left lg:w-1/2 lg:flex-grow lg:items-start lg:pl-16 lg:pl-24 lg:pt-24">
                  <h2 className="mb-4 text-4xl font-bold leading-none sm:text-5xl">
                    Darmi Fuentes
                  </h2>
                  <p className="mb-8 font-semibold leading-relaxed text-black">
                    El poder de las ideas
                  </p>
                </div>
                <div className="lg:w-full lg:max-w-2xl">
                  <img src="/images/placeholder.png" alt="img" />
                </div>
              </div>
            </div>
            <div className="mt-5">
              <div className="mx-auto flex flex-col px-5 py-24 text-left lg:flex-row">
                <div className="hidden lg:inline-block lg:w-full lg:max-w-xl">
                  <img src="/images/placeholder.png" alt="img" />
                </div>
                <div className="flex flex-col pt-0 text-left lg:w-1/2 lg:flex-grow lg:items-start lg:pl-16 lg:pl-24 lg:pt-24">
                  <h2 className="mb-4 text-4xl font-bold leading-none sm:text-5xl">
                    Robinson Castillo charris
                  </h2>
                  <p className="mb-8 font-semibold leading-relaxed text-black">
                    Marketing mediático: Cómo hacer que los hechos de la campaña se hagan noticia
                  </p>
                </div>
                <div className="inline-block lg:hidden lg:w-full lg:max-w-xl">
                  <img src="/images/placeholder.png" alt="img" />
                </div>
              </div>
            </div>
            <div className="mt-5">
              <div className="mx-auto flex flex-col px-5 py-24 text-left lg:flex-row">
                <div className="flex flex-col pt-0 text-left lg:w-1/2 lg:flex-grow lg:items-start lg:pl-16 lg:pl-24 lg:pt-24">
                  <h2 className="mb-4 text-4xl font-bold leading-none sm:text-5xl">
                    Jamer Chica
                  </h2>
                  <p className="mb-8 font-semibold leading-relaxed text-black">
                    El secreto de la victoria electoral
                  </p>
                </div>
                <div className="lg:w-full lg:max-w-2xl">
                  <img src="/images/placeholder.png" alt="img" />
                </div>
              </div>
            </div>
            <div className="mt-5">
              <div className="mx-auto flex flex-col px-5 py-24 text-left lg:flex-row">
                <div className="hidden lg:inline-block lg:w-full lg:max-w-xl">
                  <img src="/images/placeholder.png" alt="img" />
                </div>
                <div className="flex flex-col pt-0 text-left lg:w-1/2 lg:flex-grow lg:items-start lg:pl-16 lg:pl-24 lg:pt-24">
                  <h2 className="mb-4 text-4xl font-bold leading-none sm:text-5xl">
                    Yesid Guinand
                  </h2>
                  <p className="mb-8 font-semibold leading-relaxed text-black">
                    La táctica en la estrategia política
                  </p>
                </div>
                <div className="inline-block lg:hidden lg:w-full lg:max-w-xl">
                  <img src="/images/placeholder.png" alt="img" />
                </div>
              </div>
            </div>
            <div className="mt-5">
              <div className="mx-auto flex flex-col px-5 py-24 text-left lg:flex-row">
                <div className="flex flex-col pt-0 text-left lg:w-1/2 lg:flex-grow lg:items-start lg:pl-16 lg:pl-24 lg:pt-24">
                  <h2 className="mb-4 text-4xl font-bold leading-none sm:text-5xl">
                    Angie González
                  </h2>
                  <p className="mb-8 font-semibold leading-relaxed text-black">
                    El relato político
                  </p>
                </div>
                <div className="lg:w-full lg:max-w-2xl">
                  <img src="/images/placeholder.png" alt="img" />
                </div>
              </div>
            </div>
            <div className="mt-5">
              <div className="mx-auto flex flex-col px-5 py-24 text-left lg:flex-row">
                <div className="hidden lg:inline-block lg:w-full lg:max-w-xl">
                  <img src="/images/placeholder.png" alt="img" />
                </div>
                <div className="flex flex-col pt-0 text-left lg:w-1/2 lg:flex-grow lg:items-start lg:pl-16 lg:pl-24 lg:pt-24">
                  <h2 className="mb-4 text-4xl font-bold leading-none sm:text-5xl">
                    Cristian Castellanos
                  </h2>
                  <p className="mb-8 font-semibold leading-relaxed text-black">
                    Las redes sociales como herramienta de comunicación política
                  </p>
                </div>
                <div className="inline-block lg:hidden lg:w-full lg:max-w-xl">
                  <img src="/images/placeholder.png" alt="img" />
                </div>
              </div>
            </div>
          </div>
          <div className="text-black">
            <div
              className="
              max-w-9xl
              mx-auto
              flex
              flex-col
              items-center
              px-5
            "
            >
              <div className="mr-0 mb-6 w-full py-4 text-center lg:w-2/3">
                <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
                  PANELES DE DEBATE
                </h2>
                <ul className="mb-4 text-lg leading-relaxed">
                  <li>¿Cómo construir una campaña victoriosa?</li>
                  <li>La construcción de la organización electoral de la campaña política.</li>
                  <li>El día ‘D’</li>
                  <li>El papel del programa de gobierno en la campaña electoral</li>
                  <li>El costo de perder una elección</li>
                  <li>La fotografía política; clave para la victoria.</li>
                  <li>Cómo convertir hechos en noticia.</li>
                  <li>El secreto para una campaña ganadora.</li>
                  <li>Diseño de la estrategia general.</li>
                  <li>El marketing digital en política.</li>
                  <li>El poder de las ideas en la campaña política.</li>
                </ul>
              </div>
              <img
                className="
                lg:w-5/7
                mb-40
                hidden
                w-5/6
                rounded object-cover
                object-center
                lg:inline-block 
                lg:w-4/6
              "
                src="/images/placeholder.png"
                alt="img"
              />

              <img
                className="
              mb-24
              inline-block
              w-5/6
              rounded
              object-cover object-center
              lg:hidden
              lg:w-4/6 
            "
                src="/images/placeholder.png"
                alt="img"
              />
            </div>
          </div>
        </div>
        <div className="mx-auto px-5 pt-10 pb-24 lg:px-24">
          <div className="my-3 flex w-full flex-col text-left lg:text-center">
            <h2 className="bold mb-8 text-4xl font-bold leading-tight text-black lg:text-6xl">
              ¿CUÁNTO CUESTA PARTICIPAR DEL EVENTO?
            </h2>
          </div>
          <div className="flex w-full flex-col text-left lg:text-center">
            <h3 className="text-2xl text-black">
              El evento tendrá un costo de participación que dependerá de la zona de ubicación de los asistentes.
            </h3>
          </div>
        </div>
        <div className="invisible mx-auto flex max-w-6xl p-3 pb-32 lg:visible lg:px-2">
          <img src="/images/placeholder.png" alt="img" />
        </div>
        <div className="bg-white text-black">
          <div className="my-24 p-4 text-black">
            <div className="max-w-9xl mx-auto flex flex-col items-center bg-gradient-to-r from-blue-200 to-blue-100 px-5 py-24 lg:flex-row">
              <div className="flex flex-col items-center pb-16 pl-0 text-center lg:mb-0 lg:w-1/2 lg:flex-grow lg:items-start lg:pl-12 lg:pr-24 lg:text-left">
                <h2 className="pb-4 text-2xl font-bold leading-tight lg:text-4xl">
                  ¿CÓMO ESTÁ DESARROLLADA LA AGENDA DEL EVENTO?
                </h2>
                <p className="text-md mb-8 lg:text-xl">
                  En el evento participarán 10 conferencistas y en los dos días intervendrán 3 en la jornada de la mañana y 2 en la jornada de la tarde. En la jornada de la tarde se organizará un debate entre los 5 conferencistas asistentes en la fecha sobre un tema de trascendencia nacional.
                </p>
              </div>
              <div className="w-4/7 pr-12 lg:w-2/5">
                <img
                  src="/images/placeholder.png"
                  className="hidden object-cover object-center lg:inline-block"
                  alt="image"
                />
                <img
                  src="/images/placeholder.png"
                  className="inline-block object-cover object-center lg:hidden"
                  alt="image"
                />
              </div>
            </div>
          </div>
          <div className="mx-auto">
            <div className="max-w-8xl mx-auto px-5 py-10 lg:px-24">
              <div className="my-6 flex w-full flex-col text-left lg:text-center">
                <h3 className="mb-8 text-5xl font-bold text-black">
                  CRONOGRAMA DEL EVENTO
                </h3>
                <table className="table table-auto border-collapse">
                  <thead className="bg-gradient-to-r from-blue-300 to-blue-200">
                    <tr>
                      <th colSpan={3} className="p-3 border rounded">VIERNES 14 DE JULIO</th>
                    </tr>
                    <tr>
                      <th className="p-2 border rounded">Hora</th>
                      <th className="p-2 border rounded">Evento</th>
                      <th className="p-2 border rounded">A cargo de</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border rounded">7:30 AM</td>
                      <td className="p-2 border rounded">Registro en el lobby</td>
                      <td className="p-2 border rounded">-----</td>
                    </tr>
                    <tr>
                      <td className="p-2 border rounded">8:00 AM – 8:15 AM</td>
                      <td className="p-2 border rounded">Mensajes de Bienvenida</td>
                      <td className="p-2 border rounded">José Yesid Guinand Calderón</td>
                    </tr>
                    <tr>
                      <td className="p-2 border rounded">8:15 AM – 9:30 AM</td>
                      <td className="p-2 border rounded">Conferencia: El secreto de la victoria electoral</td>
                      <td className="p-2 border rounded">Jamer Chica</td>
                    </tr>
                    <tr>
                      <td className="p-2 border rounded">9:30 AM – 10:45 AM</td>
                      <td className="p-2 border rounded"> Conferencia: Marketing mediático (Cómo hacer que los hechos de la campaña se hagan noticia)</td>
                      <td className="p-2 border rounded">Robinson Castillo Charris</td>
                    </tr>
                    <tr>
                      <td className="p-2 border rounded">10:45 AM - 11:10 AM</td>
                      <td className="p-2 border rounded">Coffee Break</td>
                      <td className="p-2 border rounded">-----</td>
                    </tr>
                    <tr>
                      <td className="p-2 border rounded">11:10 AM – 12:30 PM</td>
                      <td className="p-2 border rounded">Conferencia: ‘Las redes sociales como herramienta de comunicación política’</td>
                      <td className="p-2 border rounded">Cristian Castellanos</td>
                    </tr>
                    <tr>
                      <td className="p-2 border rounded">12:30 AM - 2:00 PM</td>
                      <td className="p-2 border rounded">Espacio libre para almuerzo</td>
                      <td className="p-2 border rounded">-----</td>
                    </tr>
                    <tr>
                      <td className="p-2 border rounded">2:00 PM - 2:15 PM</td>
                      <td className="p-2 border rounded">Reingreso de los asistentes</td>
                      <td className="p-2 border rounded">-----</td>
                    </tr>
                    <tr>
                      <td className="p-2 border rounded">2:15 PM – 3:30 PM</td>
                      <td className="p-2 border rounded">Conferencia: ‘el poder de las ideas’</td>
                      <td className="p-2 border rounded">Darmi Fuentes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="text-black">
            <div className="max-w-8xl mx-auto flex flex-col px-5 py-48 text-black lg:flex-row">
              <div className="lg:mb-0 lg:w-full lg:max-w-xl">
                <img
                  className="rounded object-cover object-center"
                  alt="image"
                  src="/images/placeholder1.png"
                />
              </div>
              <div className="items-left flex flex-col pt-16 text-left lg:w-1/2 lg:flex-grow lg:items-start lg:pl-32 lg:pl-48 lg:text-left">
                <h2 className="mb-2 text-lg leading-tight text-gray-700 sm:text-lg">
                  Representantes
                </h2>
                <h2 className="mb-6 text-lg font-bold sm:text-lg">
                  Lectus eu.
                </h2>
                <h2 className="mb-4 text-3xl font-bold sm:text-3xl">
                  Lorem ipsum accumsan arcu, consectetur adipiscing elit. Sed
                  eget enim vel.
                </h2>
                <a
                  href="/"
                  className="underline-blue mt-12 text-lg font-bold leading-relaxed"
                >
                  Ut convallis massa.
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
