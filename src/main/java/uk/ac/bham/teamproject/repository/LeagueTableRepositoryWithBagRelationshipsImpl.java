package uk.ac.bham.teamproject.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import uk.ac.bham.teamproject.domain.LeagueTable;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class LeagueTableRepositoryWithBagRelationshipsImpl implements LeagueTableRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<LeagueTable> fetchBagRelationships(Optional<LeagueTable> leagueTable) {
        return leagueTable.map(this::fetchMembers);
    }

    @Override
    public Page<LeagueTable> fetchBagRelationships(Page<LeagueTable> leagueTables) {
        return new PageImpl<>(
            fetchBagRelationships(leagueTables.getContent()),
            leagueTables.getPageable(),
            leagueTables.getTotalElements()
        );
    }

    @Override
    public List<LeagueTable> fetchBagRelationships(List<LeagueTable> leagueTables) {
        return Optional.of(leagueTables).map(this::fetchMembers).orElse(Collections.emptyList());
    }

    LeagueTable fetchMembers(LeagueTable result) {
        return entityManager
            .createQuery(
                "select leagueTable from LeagueTable leagueTable left join fetch leagueTable.members where leagueTable is :leagueTable",
                LeagueTable.class
            )
            .setParameter("leagueTable", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<LeagueTable> fetchMembers(List<LeagueTable> leagueTables) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, leagueTables.size()).forEach(index -> order.put(leagueTables.get(index).getId(), index));
        List<LeagueTable> result = entityManager
            .createQuery(
                "select distinct leagueTable from LeagueTable leagueTable left join fetch leagueTable.members where leagueTable in :leagueTables",
                LeagueTable.class
            )
            .setParameter("leagueTables", leagueTables)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
