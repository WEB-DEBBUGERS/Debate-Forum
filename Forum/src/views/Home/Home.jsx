import NewsFeed from "./News/NewsFeed"
import { useContext } from "react"
import { AppContext } from "../../state/app.context"

export default function Home() {

    const { user } = useContext(AppContext);

    return (
        <div className="home">
            {!user ? <NewsFeed/> : <h1>Here will be the logged in user component Home page</h1>}
        </div>
    )
}