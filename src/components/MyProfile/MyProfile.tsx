import Profile from "../Profile/Profile"
import type { post, profile, settings } from "../../global_types"

interface MyProfileProps {
  my_profile: profile | null
  my_settings: settings

  onOpenProfile: (profile_nick: string) => void
}

export default function MyProfile(props: MyProfileProps) {
  return (<Profile 
    is_my={true}
    me={props?.my_profile}
    settings={props.my_settings}

    onOpenProfile={props.onOpenProfile}
  />)
}