import React, { useEffect, useState } from "react";
import Loading from "./Loading";

function App() {
	return (
		<>
			<React.Suspense fallback={<Loading />}>
				<i className="bx bx-menu" style={{ fontSize: "100px" }} />
                Eu sou uma batata
			</React.Suspense>
		</>
	);
}

export default App;
