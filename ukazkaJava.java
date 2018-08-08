@Entity
@Table(name = "CC_SAMPLEPLACE")
//@Locality(expression = "LOCALITY_ID")
public class Odber1 implements Serializable{
                                            // COLUMN_NAME      DATA_TYPE  NULLABLE                  
    private Integer  sampleplace_id;        // SAMPLEPLACE_ID	NUMBER	   No
    private Celek1   id_celek;              
    private Integer  celek;                 // TECHNODE_ID	NUMBER	   No
    private Kolony1  kolona;
    private Integer  id_kolony;             // COLUMN_ID	NUMBER	   Yes
    private String   odber;                 // NAME             VARCHAR2   No
    private Date     datum_vlozeni;         // INSERTDT         DATE	   Yes
    private Integer  provozni_hodiny;       // OPERHOURS	NUMBER	   Yes
    private String   localityId = "TE";     // LOCALITY_ID	CHAR	   No
   
    
    public Odber1 () {}
    
    @Id
    @Column(name = "SAMPLEPLACE_ID")
    @GeneratedValue(strategy=GenerationType.AUTO,generator="CC_SAMPLEPLACE_SEQ")
    @SequenceGenerator(name="CC_SAMPLEPLACE_SEQ",sequenceName="CC_SAMPLEPLACE_SEQ")
    
    public Integer getSampleplace_id() {
        return this.sampleplace_id;
    }
    
    public void setSampleplace_id(Integer sampleplace_id) {
        this.sampleplace_id = sampleplace_id;
    }
       
    @ManyToOne
    @JoinColumn(name = "TECHNODE_ID", referencedColumnName = "TECHNODE_ID", insertable = false, updatable = false)
    public Celek1 getId_celek() {
        return this.id_celek;
    }
    
    public void setId_celek(Celek1 id_celek) {
        this.id_celek = id_celek;
    }
    
    @Column(name = "TECHNODE_ID")
    public Integer getCelek() {
        return this.celek;
    }
    
    public void setCelek(Integer celek) {
        this.celek = celek;
    }
    
    @Column(name = "NAME")
    public String getOdber() {
        return this.odber;
    }
    
    public void setOdber(String odber) {
        this.odber = odber;
    }
    
    @Column(name = "INSERTDT")
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    public Date getDatum_vlozeni() {
        return this.datum_vlozeni;
    }
    
    public void setDatum_vlozeni(Date datum_vlozeni){
        this.datum_vlozeni = datum_vlozeni;
    }
    
    @Column(name = "OPERHOURS")
    public Integer getProvozni_hodiny() {
        return this.provozni_hodiny;
    }
    
    public void setProvozni_hodiny(Integer provozni_hodiny) {
        this.provozni_hodiny = provozni_hodiny;
    }
    
    private String oznaceni;
    @Formula("(select c.name from cc_technode c, cc_sampleplace o where o.technode_id = c.technode_id and o.sampleplace_id = sampleplace_id and locality_id = 'TE')")
    public String getOznaceni() {
        return oznaceni;
    }
    
    public void setOznaceni(String oznaceni) {
        this.oznaceni = oznaceni;
    }
    
    private String kolona1;
    @Formula("(select k.name from cc_column k, cc_sampleplace o where o.column_id = k.column_id and o.sampleplace_id = sampleplace_id)")
    public String getKolona1() {
        return kolona1;
    }
    public void setKolona1(String kolona1) {
        this.kolona1 = kolona1;
    }
    
    private Integer ph;
    @Formula("CASE WHEN OPERHOURS IS NULL THEN FLOOR(24*(CURRENT_DATE - INSERTDT)) WHEN OPERHOURS IS NOT NULL THEN FLOOR(24*(CURRENT_DATE - INSERTDT) + OPERHOURS) ELSE OPERHOURS END")
    public Integer getPh() {
        return ph;
    }
    
    public void setPh(Integer ph) {
        this.ph = ph;
    }
    
    @ManyToOne
    @JoinColumn(name = "COLUMN_ID", referencedColumnName = "COLUMN_ID", insertable = false, updatable = false)
    public Kolony1 getKolona() {
        return this.kolona;
    }
    
    public void setKolona(Kolony1 kolona) {
        this.kolona = kolona;
    }
    
    @Column(name = "COLUMN_ID")
    public Integer getId_kolony() {
        return this.id_kolony;        
    }
    
    public void setId_kolony(Integer id_kolony) {
        this.id_kolony = id_kolony;
    }
    
    @Column(name = "LOCALITY_ID")
    public String getLocalityId() {
        return this.localityId;
    }
    
    public void setLocalityId(String localityId) {
        this.localityId = localityId;
    }
}