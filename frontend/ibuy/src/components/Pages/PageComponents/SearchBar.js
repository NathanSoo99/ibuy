import React, { useState } from 'react';

import { useHistory } from 'react-router';

const SearchBar = () => {
    const history = useHistory();
    const [search, setSearch] = useState("");

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                search !== "" && history.push("/search/" + search);
            }}>
                <input
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    placeholder="search"
                    type="search"
                />
                <input type="submit" value="Search" />
            </form>
        </div>
    );
}

export default SearchBar;