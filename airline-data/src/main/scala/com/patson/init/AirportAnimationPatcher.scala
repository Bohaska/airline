package com.patson.init

import com.patson.data.{AirportAnimationSource, AirportSource}
import com.patson.model.animation._

object AirportAnimationPatcher extends App {
  import AirportAnimationType._
  val animations = Array(
    ("JFK", AIRPORT, "https://player.vimeo.com/video/506825925"),
    ("JFK", CITY, "https://player.vimeo.com/video/506868914"),
    ("JFK", CITY, "https://player.vimeo.com/video/508765597"),
    ("JFK", SCENERY, "https://player.vimeo.com/video/507867073"),
    ("LAX", AIRPORT, "https://player.vimeo.com/video/506879495"),
    ("LAX", CITY, "https://player.vimeo.com/video/506879854"),
    ("LAX", SCENERY, "https://player.vimeo.com/video/506879191"),
    ("DUS", AIRPORT, "https://player.vimeo.com/video/506896956"),
    ("YVR", AIRPORT, "https://player.vimeo.com/video/506899463"),
    ("YVR", CITY, "https://player.vimeo.com/video/506899152"),
    ("HND", AIRPORT, "https://player.vimeo.com/video/506972343"),
    ("HND", CITY, "https://player.vimeo.com/video/506972043"),
    ("NRT", AIRPORT, "https://player.vimeo.com/video/506970681"),
    ("NRT", CITY, "https://player.vimeo.com/video/506970067"),
    ("AMS", AIRPORT, "https://player.vimeo.com/video/506969661"),
    ("AMS", SCENERY, "https://player.vimeo.com/video/506969176"),
    ("CDG", AIRPORT, "https://player.vimeo.com/video/506968296"),
    ("CDG", CITY, "https://player.vimeo.com/video/506967713"),
    ("CDG", CITY, "https://player.vimeo.com/video/506967192"),
    ("LHR", AIRPORT, "https://player.vimeo.com/video/506971743"),
    ("LHR", CITY, "https://player.vimeo.com/video/506971156"),
    ("HKG", AIRPORT, "https://player.vimeo.com/video/506966797"),
    ("HKG", CITY, "https://player.vimeo.com/video/506972580"),
    ("ITM", AIRPORT, "https://player.vimeo.com/video/507438279"),
    ("ITM", SCENERY, "https://player.vimeo.com/video/507437447"),
    ("FRA", AIRPORT, "https://player.vimeo.com/video/507434551"),
    ("FRA", CITY, "https://player.vimeo.com/video/507433682"),
    ("YYZ", AIRPORT, "https://player.vimeo.com/video/507436551"),
    ("YYZ", CITY, "https://player.vimeo.com/video/507435617"),
    ("BRU", AIRPORT, "https://player.vimeo.com/video/507869726"),
    ("BRU", CITY, "https://player.vimeo.com/video/507868675"),
    ("EWR", AIRPORT, "https://player.vimeo.com/video/507867951"),
    ("ZRH", CITY, "https://player.vimeo.com/video/507870691"),
    ("ZRH", AIRPORT, "https://player.vimeo.com/video/507866484"),
    ("MEX", CITY, "https://player.vimeo.com/video/508309527"),
    ("MEX", AIRPORT, "https://player.vimeo.com/video/508300132"),
    ("MAN", CITY, "https://player.vimeo.com/video/508300628"),
    ("MAN", AIRPORT, "https://player.vimeo.com/video/508301762"),
    ("KIX", CITY, "https://player.vimeo.com/video/508303833"),
    ("KIX", AIRPORT, "https://player.vimeo.com/video/508304975"),
    ("CGN", CITY, "https://player.vimeo.com/video/508305347"),
    ("CGN", AIRPORT, "https://player.vimeo.com/video/508306547"),
    ("TLV", AIRPORT, "https://player.vimeo.com/video/508307466"),
    ("SYD", CITY, "https://player.vimeo.com/video/508307743"),
    ("NGO", CITY, "https://player.vimeo.com/video/508308675"),
    ("LGW", AIRPORT, "https://player.vimeo.com/video/508302845"),
    ("ORY", AIRPORT, "https://player.vimeo.com/video/508308343"),
    ("YUL", CITY, "https://player.vimeo.com/video/509375841"),
    ("YUL", AIRPORT, "https://player.vimeo.com/video/509376388"),
    ("MUC", CITY, "https://player.vimeo.com/video/509376687"),
    ("MUC", AIRPORT, "https://player.vimeo.com/video/509377200"),
    ("GRU", CITY, "https://player.vimeo.com/video/509373993"),
    ("GRU", AIRPORT, "https://player.vimeo.com/video/509374672"),
    ("MEL", CITY, "https://player.vimeo.com/video/509377717"),
    ("MEL", AIRPORT, "https://player.vimeo.com/video/509372694"),
    ("MAD", CITY, "https://player.vimeo.com/video/509372849"),
    ("MAD", AIRPORT, "https://player.vimeo.com/video/509373594"),
    ("BER", CITY, "https://player.vimeo.com/video/509375162"),
    ("BER", AIRPORT, "https://player.vimeo.com/video/509375681"),
    ("DFW", CITY, "https://player.vimeo.com/video/510135347"),
    ("DFW", AIRPORT, "https://player.vimeo.com/video/510136508"),
    ("FCO", CITY, "https://player.vimeo.com/video/510131403"),
    ("FCO", CITY, "https://player.vimeo.com/video/510133056"),
    ("FCO", AIRPORT, "https://player.vimeo.com/video/510134505"),
    ("HAM", CITY, "https://player.vimeo.com/video/510129228"),
    ("HAM", AIRPORT, "https://player.vimeo.com/video/510130559"),
    ("LGG", CITY, "https://player.vimeo.com/video/510127556"),
    ("PHX", CITY, "https://player.vimeo.com/video/510138712"),
    ("PHX", AIRPORT, "https://player.vimeo.com/video/510140192"),
    ("SIN", CITY, "https://player.vimeo.com/video/510137307"),
    ("VIE", CITY, "https://player.vimeo.com/video/510573871"),
    ("VIE", AIRPORT, "https://player.vimeo.com/video/510575231"),
    ("STR", CITY, "https://player.vimeo.com/video/510575953"),
    ("STR", AIRPORT, "https://player.vimeo.com/video/510577282"),
    ("MXP", CITY, "https://player.vimeo.com/video/510578026"),
    ("MXP", AIRPORT, "https://player.vimeo.com/video/510579402"),
    ("LEJ", CITY, "https://player.vimeo.com/video/510580158"),
    ("LEJ", AIRPORT, "https://player.vimeo.com/video/510580837"),
    ("FUK", CITY, "https://player.vimeo.com/video/510581317"),
    ("FUK", AIRPORT, "https://player.vimeo.com/video/510582111"),
    ("EZE", CITY, "https://player.vimeo.com/video/510582839"),
    ("EZE", AIRPORT, "https://player.vimeo.com/video/510584086"),
    ("BNE", CITY, "https://player.vimeo.com/video/510570192"),
    ("BNE", AIRPORT, "https://player.vimeo.com/video/510571230"),
    ("BHX", CITY, "https://player.vimeo.com/video/510572324"),
    ("BHX", AIRPORT, "https://player.vimeo.com/video/510573450"),
    ("PER", CITY, "https://player.vimeo.com/video/511025514"),
    ("NAP", CITY, "https://player.vimeo.com/video/511016720"),
    ("NAP", AIRPORT, "https://player.vimeo.com/video/511019023"),
    ("HAJ", CITY, "https://player.vimeo.com/video/511019747"),
    ("HAJ", AIRPORT, "https://player.vimeo.com/video/511020409"),
    ("DEN", CITY, "https://player.vimeo.com/video/511021139"),
    ("DEN", AIRPORT, "https://player.vimeo.com/video/511022246"),
    ("CAN", AIRPORT, "https://player.vimeo.com/video/511023023"),
    ("BCN", CITY, "https://player.vimeo.com/video/511023294"),
    ("BCN", AIRPORT, "https://player.vimeo.com/video/511024646"),
    ("LYS", CITY, "https://player.vimeo.com/video/512054162"),
    ("LYS", AIRPORT, "https://player.vimeo.com/video/512053460"),
    ("LAS", CITY, "https://player.vimeo.com/video/512052441"),
    ("LAS", AIRPORT, "https://player.vimeo.com/video/512051702"),
    ("GVA", CITY, "https://player.vimeo.com/video/512050597"),
    ("GVA", AIRPORT, "https://player.vimeo.com/video/512049721"),
    ("GIG", CITY, "https://player.vimeo.com/video/512047998"),
    ("GIG", AIRPORT, "https://player.vimeo.com/video/512046860"),
    ("ARN", CITY, "https://player.vimeo.com/video/512046161"),
    ("ORD", CITY, "https://player.vimeo.com/video/514185334"),
    ("ORD", AIRPORT, "https://player.vimeo.com/video/514186779"),
    ("IAH", CITY, "https://player.vimeo.com/video/514188050"),
    ("IAH", AIRPORT, "https://player.vimeo.com/video/514188872"),
    ("CPH", CITY, "https://player.vimeo.com/video/514182192"),
    ("CPH", AIRPORT, "https://player.vimeo.com/video/514183474"),
    ("SAN", AIRPORT, "https://player.vimeo.com/video/514184236"),
    ("SAN", CITY, "https://player.vimeo.com/video/514581108"),
    ("SAN", SCENERY, "https://player.vimeo.com/video/514580492"),
    ("VCE", CITY, "https://player.vimeo.com/video/514582833"),
    ("VCE", AIRPORT, "https://player.vimeo.com/video/514584250"),
    ("SFO", CITY, "https://player.vimeo.com/video/514584771"),
    ("SFO", AIRPORT, "https://player.vimeo.com/video/514586925"),
    ("SCL", CITY, "https://player.vimeo.com/video/514579280"),
    ("SCL", AIRPORT, "https://player.vimeo.com/video/514580072"),
    ("VRN", CITY, "https://player.vimeo.com/video/514582214"),
    ("ONT", AIRPORT, "https://player.vimeo.com/video/514581713"),
    ("CRL", AIRPORT, "https://player.vimeo.com/video/514181568"),
    ("BOS", CITY, "https://player.vimeo.com/video/514765094"),
    ("BOS", AIRPORT, "https://player.vimeo.com/video/514765991"),
    ("ATL", CITY, "https://player.vimeo.com/video/514766748"),
    ("ATL", AIRPORT, "https://player.vimeo.com/video/514764313"),
    ("MIA", CITY, "https://player.vimeo.com/video/514767571"),
    ("MIA", AIRPORT, "https://player.vimeo.com/video/514768275"),
    ("IAD", AIRPORT, "https://player.vimeo.com/video/514768887"),
    ("KTW", CITY, "https://player.vimeo.com/video/514769522"),
    ("WAW", CITY, "https://player.vimeo.com/video/514770276"),
    ("WAW", AIRPORT, "https://player.vimeo.com/video/514771139"),
    ("GDL", CITY, "https://player.vimeo.com/video/514771989"),
    ("BUD", CITY, "https://player.vimeo.com/video/514773012"),
    ("BUD", AIRPORT, "https://player.vimeo.com/video/514773832"),
    ("OTP", CITY, "https://player.vimeo.com/video/514774724"),
    ("OTP", AIRPORT, "https://player.vimeo.com/video/514775728"),
    ("JNB", CITY, "https://player.vimeo.com/video/514776606"),
    ("JNB", AIRPORT, "https://player.vimeo.com/video/514777507"),
    ("TLC", CITY, "https://player.vimeo.com/video/514778295"),
    ("OSL", CITY, "https://player.vimeo.com/video/514759637"),
    ("DUB", CITY, "https://player.vimeo.com/video/514763567"),
    ("DUB", AIRPORT, "https://player.vimeo.com/video/514760536"),
    ("MRS", CITY, "https://player.vimeo.com/video/514762173"),
    ("MRS", AIRPORT, "https://player.vimeo.com/video/514762752"),
    ("EIN", CITY, "https://player.vimeo.com/video/514761321"),
    ("MCO", SCENERY, "https://player.vimeo.com/video/514856542"),
    ("MCO", AIRPORT, "https://player.vimeo.com/video/514853307"),
    ("PHL", CITY, "https://player.vimeo.com/video/514855475"),
    ("PHL", AIRPORT, "https://player.vimeo.com/video/514856016"),
    ("CLT", CITY, "https://player.vimeo.com/video/514854560"),
    ("CLT", AIRPORT, "https://player.vimeo.com/video/514855066"),
    ("DTW", CITY, "https://player.vimeo.com/video/514853721"),
    ("DTW", AIRPORT, "https://player.vimeo.com/video/514854158"),
    ("YYC", CITY, "https://player.vimeo.com/video/515077076"),
    ("YYC", AIRPORT, "https://player.vimeo.com/video/515077812"),
    ("SLC", CITY, "https://player.vimeo.com/video/515078538"),
    ("SLC", AIRPORT, "https://player.vimeo.com/video/515079364"),
    ("SEA", CITY, "https://player.vimeo.com/video/515080040"),
    ("SEA", AIRPORT, "https://player.vimeo.com/video/515080771"),
    ("SDJ", CITY, "https://player.vimeo.com/video/515081538"),
    ("SDJ", AIRPORT, "https://player.vimeo.com/video/515082448"),
    ("PDX", CITY, "https://player.vimeo.com/video/515083192"),
    ("PDX", AIRPORT, "https://player.vimeo.com/video/515068495"),
    ("MSP", CITY, "https://player.vimeo.com/video/515069152"),
    ("MSP", AIRPORT, "https://player.vimeo.com/video/515069979"),
    ("MFM", CITY, "https://player.vimeo.com/video/515070705"),
    ("MFM", AIRPORT, "https://player.vimeo.com/video/515071430"),
    ("JTR", CITY, "https://player.vimeo.com/video/515072075"),
    ("HNL", CITY, "https://player.vimeo.com/video/515072619"),
    ("HNL", AIRPORT, "https://player.vimeo.com/video/515073341"),
    ("CTS", CITY, "https://player.vimeo.com/video/515074141"),
    ("BWI", CITY, "https://player.vimeo.com/video/515074919"),
    ("BWI", AIRPORT, "https://player.vimeo.com/video/515075666"),
    ("ATH", CITY, "https://player.vimeo.com/video/515076440"),
    ("AGP", CITY, "https://player.vimeo.com/video/517923124"),
    ("AGP", AIRPORT, "https://player.vimeo.com/video/517922440"),
    ("ALC", CITY, "https://player.vimeo.com/video/517924710"),
    ("ALC", AIRPORT, "https://player.vimeo.com/video/517923909"),
    ("EDI", CITY, "https://player.vimeo.com/video/517925521"),
    ("GLA", CITY, "https://player.vimeo.com/video/517913458"),
    ("GLA", AIRPORT, "https://player.vimeo.com/video/517926213"),
    ("HEL", CITY, "https://player.vimeo.com/video/517915297"),
    ("HEL", AIRPORT, "https://player.vimeo.com/video/517914434"),
    ("LBA", CITY, "https://player.vimeo.com/video/517916845"),
    ("LBA", AIRPORT, "https://player.vimeo.com/video/517916083"),
    ("NCL", CITY, "https://player.vimeo.com/video/517919409"),
    ("NCL", AIRPORT, "https://player.vimeo.com/video/517918748"),
    ("PRG", CITY, "https://player.vimeo.com/video/517920856"),
    ("PRG", AIRPORT, "https://player.vimeo.com/video/517920162"),
    ("TLS", CITY, "https://player.vimeo.com/video/517917805"),
    ("TLS", AIRPORT, "https://player.vimeo.com/video/517921679"),
    ("AKL", CITY, "https://player.vimeo.com/video/517973793"),
    ("CPT", CITY, "https://player.vimeo.com/video/517975114"),
    ("CPT", AIRPORT, "https://player.vimeo.com/video/517974459"),
    ("BEG", CITY, "https://player.vimeo.com/video/520464062"),
    ("BEG", AIRPORT, "https://player.vimeo.com/video/520463557"),
    ("HER", CITY, "https://player.vimeo.com/video/520464659"),
    ("MTY", CITY, "https://player.vimeo.com/video/520465197"),
    ("NCE", CITY, "https://player.vimeo.com/video/520466277"),
    ("NCE", AIRPORT, "https://player.vimeo.com/video/520465776"),
    ("OAK", CITY, "https://player.vimeo.com/video/520458669"),
    ("OAK", AIRPORT, "https://player.vimeo.com/video/520458138"),
    ("SJC", CITY, "https://player.vimeo.com/video/520459869"),
    ("SJC", AIRPORT, "https://player.vimeo.com/video/520459302"),
    ("SOF", CITY, "https://player.vimeo.com/video/520461666"),
    ("SOF", AIRPORT, "https://player.vimeo.com/video/520461111"),
    ("TIJ", CITY, "https://player.vimeo.com/video/520462894"),
    ("TIJ", AIRPORT, "https://player.vimeo.com/video/520462294"),
    ("SKG", CITY, "https://player.vimeo.com/video/520460485"),
    ("BOI", CITY, "https://player.vimeo.com/video/506881395"),
  )

  def patchAirportAnimations() = {
    val animationList = animations.map {
      case (iata, animationType, url) => AirportAnimation(AirportSource.loadAirportByIata(iata).get, animationType, url)
    }.toList
    AirportAnimationSource.updateAirportAnimations(animationList)
  }

  patchAirportAnimations()
}
