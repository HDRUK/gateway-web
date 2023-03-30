import { Loading } from "@/components";
import { useUser } from "@/lib/hooks";

const Welcome = () => {
	const { user, error } = useUser();

	if (error) return <div>error...</div>;
	if (!user) return <Loading />;

	return (
		<div>
			Welcome {user.firstname} {user.lastname}
		</div>
	);
};

export default Welcome;
