import Profile from "../Profile/Profile"
import type { post, profile, settings } from "../../global_types"

interface OtherProfileProps {
  my_profile: profile | null
  my_settings: settings
  other_nick: string
  is_following: boolean
  
  onFollow: () => void
  onOpenProfile: (profile_nick: string) => void

}

export default function OtherProfile(props: OtherProfileProps) {
  return (<Profile 
    is_my={false}

    me={props?.my_profile}
    settings={props.my_settings}
    other_nick={props.other_nick}
    is_followed={props.is_following}

    onFollow={props.onFollow}
    onOpenProfile={props.onOpenProfile}
  />)
}