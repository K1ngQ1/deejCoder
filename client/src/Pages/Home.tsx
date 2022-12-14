export default function HomePage() {
    return (
        <div>
            <article className="prose">
                <h1 className="text-primary">What is this site?</h1>
                <p>
                    This page was created to help with the coding part of the
                    deej project on github. I decided to create this to help
                    non-coding members out and allow them to create code and
                    have guides to code their arduinos and deej controllers.
                </p>
                <p>
                    I am however limited to components to code because of the
                    fact that I only have access to a limited amount of pieces
                    to add to the arduino but I am expanding my collection to
                    help all the newcomers. This is a one man operation
                    currently so progress is slow and I am a broke college
                    student so that doesn't help with time and money.
                </p>
                <p>
                    Please note that this website is not officially related to
                    the original deej project on Github and that a majority of
                    the code that I am using to create my snippets for you to
                    copy is a altered form of the original code found on the
                    original deej project found{" "}
                    <a href="https://github.com/omriharel/deej" target="_blank">
                        here
                    </a>
                    {/* . My guides are also based on the original guides found on
                    the deej Github. */}
                </p>
            </article>
            {/* <br />
            <article className="prose">
                <h1 className="text-primary">Some Guides I made</h1>
                <Link to="/guides">
                    <button className="btn btn-accent">Guides</button>
                </Link>
            </article> */}
           
        </div>
    );
}
