package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LeagueTable.
 */
@Entity
@Table(name = "league_table")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LeagueTable implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @ManyToMany
    @JoinTable(
        name = "rel_league_table__members",
        joinColumns = @JoinColumn(name = "league_table_id"),
        inverseJoinColumns = @JoinColumn(name = "members_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "friends", "studySession", "leagues" }, allowSetters = true)
    private Set<UserExtended> members = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LeagueTable id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public LeagueTable name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<UserExtended> getMembers() {
        return this.members;
    }

    public void setMembers(Set<UserExtended> userExtendeds) {
        this.members = userExtendeds;
    }

    public LeagueTable members(Set<UserExtended> userExtendeds) {
        this.setMembers(userExtendeds);
        return this;
    }

    public LeagueTable addMembers(UserExtended userExtended) {
        this.members.add(userExtended);
        userExtended.getLeagues().add(this);
        return this;
    }

    public LeagueTable removeMembers(UserExtended userExtended) {
        this.members.remove(userExtended);
        userExtended.getLeagues().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LeagueTable)) {
            return false;
        }
        return id != null && id.equals(((LeagueTable) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LeagueTable{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
